const express = require("express");
const router = express.Router();
const {PrismaClient} = require("@prisma/client");
const axios = require("axios");
const {sendReservationRequest} = require("../util");

const prisma = new PrismaClient()
router.post("/", (req, res) => {
    const {userId, parkingSpotId, endHr, endMin} = req.body;
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
            res.status(200).send({message: "Reservation created successfully."})
        }).catch(err => {
            console.log("Err1")
            console.log(err)
            res.status(500).send({message: "Couldn't create reservation."});
        })
    }).catch(err => {
        console.log("err2")
        console.log(JSON.stringify(err))
        res.status(500).send({message: "Couldn't create reservation."});
    })

})

router.get("/", (req, res) => {
    prisma.reservation.findMany().then(reservations => {
        res.status(200).send(reservations)
    }).catch(err => {
        console.log(err)
        res.status(500).send({message: 'Internal server error.'});
    })
})

module.exports = router;