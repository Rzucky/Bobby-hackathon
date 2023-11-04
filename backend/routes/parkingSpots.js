const express = require("express");
const {PrismaClient} = require("@prisma/client");
const router = express.Router();
const API_URL_KUKAC = "https://hackathon.kojikukac.com/api/ParkingSpot"
const prisma = new PrismaClient();

router.get("/", (req, res) => {
    res.send(Object.values(global.parkingSpots))
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

    fetch(API_URL_KUKAC + "/reserve", {
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
})


module.exports = router;