const express = require("express");
const {PrismaClient} = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient()
router.post("/", (req, res) => {
    let {licensePlate, latitude, longitude, message} = req.body

    if (licensePlate === undefined || latitude === undefined || longitude === undefined || message === undefined) {
        res.status(400).send({message: 'Invalid request, missing parameters.'});
        return;
    }

    prisma.alert.create({
        data: {
            licensePlate,
            latitude,
            longitude,
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