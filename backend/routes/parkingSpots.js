const express = require("express");
const {PrismaClient} = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const axios = require('axios');
const AccessControl = require('accesscontrol');

const ac = new AccessControl();

ac.grant('user')
  .create('reservation')
  .readOwn('profile')
  .readOwn('reservation')
  .updateOwn('profile');

ac.grant('admin')
  .extend('user')
  .create('spot')
  .deleteAny('spot')
  .readAny('data')
  .updateAny('profile')
  .createAny('profile')

global.ac = ac;

router.get("/", (req, res) => {
    res.send(global.parkingSpots)
})

router.get("/unoccupied", (req, res) => {
    const spotsArray = Object.values(global.parkingSpots);
    const unoccupiedSpotsArray = spotsArray.filter(spot => !spot.occupied);

    res.send(unoccupiedSpotsArray);
})

router.get("/:id", (req, res) => {
    const id = req.params.id;
    res.send(global.parkingSpots[id])
})

router.post("/reserve/:id", (req, res) => {
    const id = req.params.id;
    const endH = req.body.endH;
    const endM = req.body.endM;

    if (endH === undefined || endM === undefined) {
        res.status(400).send({message: 'Invalid request, missing parameters endH or endM.'});
        return;
    }

    const { role } = req.user;
    if (ac.can(role).create('reservation').granted) {
        fetch(global.config.PARKING_API + "/api/ParkingSpot/reserve", {
            method: 'POST', headers: {
                'accept': '*/*', 'Api-Key': process.env.API_KEY, 'Content-Type': 'application/json'
            }, body: {
                id, endH, endM
            }
        })
            .then(response => response.json()
            )
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    res.status(400).send({message: response.statusText});
                    return
                }
                console.log(response);
                global.parkingSpots[id].occupied = true;
                res.send(global.parkingSpots[id])
            })
    }
})

router.post("/create", async (req, res) => {
    const {latitude, longitude, parkingSpotZone} = req.body;
    console.log(req.user)
    const { role } = req.user;
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

            return res.status(201).send({error: false, data: spot, message: 'Spot created successfully'});
        } catch (error) {
            console.log(error);
            return res.status(201).send({ error: true, data: {}, notice: 'Internal error' });
        }
    }
    return res.status(403).json({ message: 'Forbidden' });
})

router.delete("/delete", async (req, res) => {
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
            
            global.parkingSpots[id] = null;


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
})



module.exports = router;