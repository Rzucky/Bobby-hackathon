const express = require("express");
const router = express.Router();
const {PrismaClient} = require("@prisma/client");
const axios = require("axios");
const {sendReservationRequest} = require("../util");

const prisma = new PrismaClient()
router.post("/", (req, res) => {
    const {userId, parkingSpotId, endHr, endMin} = req.body;

    const { role } = req.user;
    if (ac.can(role).create('reservation').granted) {
        if (!(parkingSpotId in global.parkingSpots)) {
            res.status(400).send({message: "Parking spot doesn't exist."})
            return;
        }
        if (global.parkingSpots[parkingSpotId].occupied) {
            res.status(400).send({message: "Parking spot is already occupied."})
            return;
        }
        sendReservationRequest(parkingSpotId, parseInt(global.hours) + 2, 0).then(response => {
            prisma.reservation.create({
                data: {
                    userId,
                    parkingSpotId,
                    endHr: parseInt(endHr),
                    endMin: parseInt(endMin)
                }
            }).then(reservation => {
                return res.status(200).send({message: "Reservation created successfully."})
            }).catch(err => {
                console.log("Err1")
                console.log(err)
                return res.status(500).send({message: "Couldn't create reservation."});
            })
        }).catch(err => {
            console.log("err2")
            console.log(JSON.stringify(err))
            return res.status(500).send({message: "Couldn't create reservation."});
        })
    }
    return res.status(403).json({ message: 'Forbidden' });
})

router.get("/", (req, res) => {
    prisma.reservation.findMany().then(reservations => {
        res.status(200).send(reservations)
    }).catch(err => {
        console.log(err)
        res.status(500).send({message: 'Internal server error.'});
    })
})

router.get("/:email", async (req, res) => {
    const email = req.params.email;
    
    if (email === undefined) {
        res.status(400).send({message: 'Invalid request, missing parameters email'});
        return;
    }

    const { role } = req.user;
    if (ac.can(role).readOwn('reservation').granted) {
        try {    
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            })
            if (!user)
            {
                return res.status(400).send({message: 'No reservations'});
            }
            const reservation = await prisma.reservation.findFirst({ 
                where: {
                    userId: user.id
                }
            })
            if(!reservation)
            {
                return res.status(400).send({message: 'No reservations'});
            }
            return res.status(200).send(reservation)
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal error'});
        }
    }
})

module.exports = router;
