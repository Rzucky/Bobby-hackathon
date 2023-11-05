const {createServer} = require('http');
const bodyParser = require('body-parser')

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
const {Server} = require("socket.io");

class Routing {
    constructor() {
        const app = express();
        const server = require('http').createServer(app);
        const io = new Server(server, {
            cors: {
                origin: '*',
            }
        });

        server.listen(3000)
        io.on('connection', socket => {
            console.log("Connected", socket)
        });

        global.io = io;

        app.use(expressCspHeader({
            policies: {
                'default-src': [expressCspHeader.NONE],
                'img-src': [expressCspHeader.SELF],
            },
            }));
        app.use(cors());
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())

        this.app = app
        global.app = app
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
            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    start() {

        this.app.use(express.json());
        this.app.use('/api/auth', authenticationRoutes);
        this.app.use('/api/parkingSpots',this.authMiddleware, parkingSpotsRoutes)
        this.app.use('/api/alerts',this.authMiddleware,alertsRoutes)
        this.app.use('/api/reservations', this.authMiddleware, reservationsRoutes);
        // this.app.use('/test', this.authMiddleware, this.test);
        // this.app.post('/create_spot', this.authMiddleware, this.createSpot);
        // this.app.delete('/delete_spot', this.authMiddleware, this.deleteSpot);

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