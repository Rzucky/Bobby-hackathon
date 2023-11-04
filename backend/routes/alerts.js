const express = require("express");
const {PrismaClient} = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient()
router.post("/", (req, res) => {
    let {licensePlate, parkingSpotId, message} = req.body

    prisma.alert.create({
        data: {
            licensePlate,
            parkingSpotId,
            message
        }
    }).then(alert => {
        res.status(200).send({message: "Alert created successfully."})
    }).catch(err => {
        console.log(err)
        res.status(500).send({message: 'Internal server error.'});
    })


})

router.get("/", (req, res) => {
    prisma.alert.findMany().then(alerts => {
        res.status(200).send(alerts)
    }).catch(err => {
        console.log(err)
        res.status(500).send({message: 'Internal server error.'});
    })
})


module.exports = router;