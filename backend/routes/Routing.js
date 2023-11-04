const {createServer} = require('http');
const bodyParser = require('body-parser')
const axios = require('axios');

const {PrismaClient} = require("../../node_modules/@prisma/client");
const prisma = new PrismaClient()

const express = require('express');
const cors = require("cors");
const {
    expressCspHeader, INLINE, NONE, SELF,
  } = require('express-csp-header');

const jwt = require('jsonwebtoken');

const authenticationRoutes = require('./authentication');
const parkingSpotsRoutes = require('./parkingSpots');
const alertsRoutes = require('./alerts');
const reservationsRoutes = require('./reservations');

const AccessControl = require('accesscontrol');
const { randomUUID } = require('crypto');
const ac = new AccessControl();

ac.grant('user')
  .readAny('data')
  .readOwn('profile')
  .updateOwn('profile');

ac.grant('admin')
  .extend('user')
  .create('spot')
  .deleteAny('spot')
  .readAny('data')
  .readAny('reports')
  .updateAny('profile')
  .createAny('profile')
  .createAny('threat');


class Routing {
    constructor() {
        const app = express();

        app.use(expressCspHeader({
            policies: {
                'default-src': [expressCspHeader.NONE],
                'img-src': [expressCspHeader.SELF],
            },
            }));
        app.use(cors());
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())
        const server = createServer(app);

        this.app = app

        // server.listen(3000, () => {
        //     console.log('server running at http://localhost:3000');
        // });
    }


    authMiddleware(req, res, next) {
        const token = req.headers.authorization;
        console.log(req.headers)
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, global.config.HASH_KEY);
            req.user = decoded;
            console.log('AAAAAAAAAA')
            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    async createSpot(req, res) {
        const {latitude, longitude, parkingSpotZone} = req.body;
        console.log(req.user)
        const { role } = req.user;
        console.log(role)
        if (ac.can(role).create('spot').granted) {
            try {


                const resp = await axios.post(global.config.PARKING_API + '/api/ParkingSpot',
                {
                    latitude,
                    longitude,
                    parkingSpotZone
                },
                {
                    headers: {
                        'Api-Key': global.config.API_KEY
                    }
                }
                )
                console.log(resp)

                if (resp.status != 200) {
                    throw new Error(resp)
                }

                const spot = await prisma.spot.create({
                    data: {
                        latitude,
                        longitude,
                        parkingSpotZone,
                        id: resp.data.id
                    }
                })

                return res.status(201).send({error: false, message: 'Spot created successfully'});
            } catch (error) {
                console.log(error);
                return res.status(201).send({ error: true, data: {}, notice: 'Internal error' });
            }
        }
        return res.status(403).json({ message: 'Forbidden' });
    }

    async deleteSpot(req, res) {
        const {id} = req.body;

        const { role } = req.user;
        if (ac.can(role).deleteAny('spot').granted) {
            try {

                const spot = await prisma.spot.findUnique({
                    where: {
                      id,
                    },
                  })
                if (!spot)
                {
                    return res.status(400).send({error: true, message:"Doesn't exist"})
                }
                console.log(spot)
                // TODO cache clean
                await prisma.spot.delete({
                    where: {
                        id
                    }
                })

                const resp = await axios.delete(global.config.PARKING_API + `/api/ParkingSpot/${id}`,
                {
                    headers: {
                        'Api-Key': global.config.API_KEY
                    }
                })
                console.log(resp)

                if (resp.status != 200) {
                    throw new Error(resp)
                }

                return res.status(201).send({error: false, message: 'Spot deleted successfully'});
            } catch (error) {
                console.log(error);
                return res.status(201).send({ error: true, data: {}, notice: 'Internal error' });
            }
        }
        return res.status(403).json({ message: 'Forbidden' });
    }


    start() {
        this.app.use(express.json());
        this.app.use('/api/auth', authenticationRoutes);
        this.app.use('/api/parkingSpots', parkingSpotsRoutes);
        this.app.use('/api/alerts',alertsRoutes)
        this.app.use('/api/reservations', reservationsRoutes);
        // this.app.use('/test', this.authMiddleware, this.test);
        this.app.post('/create_spot', this.authMiddleware, this.createSpot);
        this.app.delete('/delete_spot', this.authMiddleware, this.deleteSpot);

        // this.app.post('/createProfile', this.authMiddleware, this.createProfile);
        // this.app.get('/users', this.authMiddleware, this.getUsers);
        // this.app.post('/simulateUrl', this.authMiddleware, this.checkThreat, this.simulateUrl);
        // this.app.get('/getStats', this.authMiddleware, this.getStats);
        // this.app.get('/insertThreat', this.authMiddleware, this.insertThreat);
        // this.app.get('/alerts', this.authMiddleware, this.getAlerts);
        // this.app.get('/threats', this.authMiddleware, this.getThreats);
        // this.app.get('/reports', this.authMiddleware, this.getReport);
        // this.app.get('/devcode/:username', this.devcode);
        // this.app.post('/delete', this.authMiddleware, this.deleteProfile);

        this.app.listen(global.config.PORT, () => {
            // eslint-disable-next-line no-console
            console.log('Routing server started on port' + global.config.PORT);
        });
    }


}

module.exports = Routing