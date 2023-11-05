const express = require("express");
const router = express.Router();
const {PrismaClient} = require("@prisma/client");
const axios = require("axios");
const {sendReservationRequest, Time, persistReservationHistory} = require("../util");

const prisma = new PrismaClient()
router.post("/", async (req, res) => {
    const {userId, parkingSpotId, endHr, endMin} = req.body;

    let user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    const {type} = user;
    if (ac.can(type).create('reservation').granted) {
        if (!(parkingSpotId in global.parkingSpots)) {
            res.status(400).send({message: "Parking spot doesn't exist."})
            return;
        }
        if (global.parkingSpots[parkingSpotId].occupied) {
            res.status(400).send({message: "Parking spot is already occupied."})
            return;
        }
        return sendReservationRequest(parkingSpotId, parseInt(global.time.hours) + 2, 0).then(async response => {
            await prisma.reservation.create({
                data: {
                    userId,
                    parkingSpotId,
                    endTime: new Time(parseInt(endHr), parseInt(endMin)).getTime()
                }
            })

            await persistReservationHistory(prisma, userId, parkingSpotId, global.time.getTime(), true)

            await prisma.reservationLength.create({
                data: {
                    userId,
                    parkingSpotId,
                    length: new Time(parseInt(endHr), parseInt(endMin)).diffHours(global.time)
                }
            })
        })
            .then (() => {
                return res.status(200).send({message: "Reservation created successfully."});
            })
            .catch(err => {
            console.log("err2")
                console.log(err)
            return res.status(500).send({message: "Couldn't create reservation."});
        })
    }
    else {
        return res.status(403).json({message: 'Forbidden'});

    }
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

    const {role} = req.user;
    if (ac.can(role).readOwn('reservation').granted) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            })
            if (!user) {
                return res.status(400).send({message: 'No reservations'});
            }
            const reservation = await prisma.reservation.findFirst({
                where: {
                    userId: user.id
                }
            })
            if (!reservation) {
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
