const express = require("express");
const router = express.Router();
const {PrismaClient} = require("@prisma/client");
const axios = require("axios");
const {sendReservationRequest, Time, persistReservationHistory, getCurrentTime, calculateTimeDifferenceWithPrice} = require("../util");

const prisma = new PrismaClient()
router.post("/", async (req, res) => {
    const {userId, parkingSpotId, endHr, endMin} = req.body;

    const {role} = req.user;
    if (ac.can(role).create('reservation').granted) {
        if (!(parkingSpotId in global.parkingSpots)) {
            res.status(400).send({message: "Parking spot doesn't exist."})
            return;
        }
        if (global.parkingSpots[parkingSpotId].occupied) {
            res.status(400).send({message: "Parking spot is already occupied."})
            return;
        }
        return sendReservationRequest(parkingSpotId, getCurrentTime().hours + 2, 0).then(async response => {
            await prisma.reservation.create({
                data: {
                    userId,
                    parkingSpotId,
                    endTime: new Time(parseInt(endHr), parseInt(endMin)).getTime()
                }
            })

            await persistReservationHistory(prisma, userId, parkingSpotId, getCurrentTime().getTime(), true)

            await prisma.reservationLength.create({
                data: {
                    userId,
                    parkingSpotId,
                    length: new Time(parseInt(endHr), parseInt(endMin)).diffHours(getCurrentTime()) + 1 ,
                    time: getCurrentTime().getTime()
                }
            })
        })
            .then (() => {
                return res.status(200).send({message: "Reservation created successfully."});
            })
            .catch(err => {
                console.log(err.response.data)
            return res.status(500).send({message: "Couldn't create reservation."});
        })
    }
    else {
        return res.status(403).json({message: 'Forbidden'});

    }
})

router.post("/finish", async (req, res) => {
    const {parkingSpotId, email} = req.body;
    console.log(req.user)
    const {role} = req.user;
    if (ac.can(role).delete('reservation').granted){
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            })
            console.log(user, req.user)
            if ((!user || user.email != req.user.email) && req.user.role != 'admin')
            {
                return res.status(400).send({message: "User doesn't exist"});
            }
            const resp = await prisma.reservation.findFirst({
                where: {
                    userId: user.id,
                    parkingSpotId
                }
            });
            console.log(resp)
            if (resp == null) {
                return res.status(400).send({message: 'Already finished'})
            }

            await prisma.reservation.deleteMany({
                where: {
                    userId: user.id,
                    parkingSpotId
                }
            })   

            await persistReservationHistory(prisma, user.id, parkingSpotId, getCurrentTime().getTime(), false)

            const reservations = await prisma.reservationHistory.findMany({
                where: {
                    userId: user.id,
                    parkingSpotId
                }
            }) 
            let times = []
            for (const reservation of reservations)
            {
                times.push({
                    time: reservation.endTime,
                    price: reservation.price
                })
            }

            const calcs = await calculateTimeDifferenceWithPrice(times)
            

            return res.status(200).send({error: false, data: {
                message: `Total parked time: ${calcs.hours} hours and ${calcs.minutes} minutes`,
                price: calcs.price
            } , message: 'success' })
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal error'});
        }
    } else {
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
            if ((!user || user.email != req.user.email) && req.user.role != 'admin')
            {
                return res.status(400).send({message: "User doesn't exist"});
            }
            const reservation = await prisma.reservation.findFirst({
                where: {
                    userId: user.id
                }
            })

            let stats = null
            if (global.userStats[user.id] != null) {
                stats = global.userStats[user.id]
            };

            let userStats = { 
                stats: stats ?? 'No stats', 
                reservation: reservation ?? 'No reservation'
            }

            return res.status(200).send({error: false, data: userStats })
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal error'});
        }
    } else {
        return res.status(403).json({message: 'Forbidden'});

    }
})

module.exports = router;
