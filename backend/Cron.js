
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const uuid = require('uuid')
class Cron {
    constructor() {
        this.startup();
        // global.waitingBackup = false;
        // this.startBackup();
    }

    async startup() {
        let parkingSpots = fetch(global.config.PARKING_API + '/api/ParkingSpot/getAll', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Api-Key': global.config.API_KEY
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(pSpots => {
                global.parkingSpots = pSpots.reduce(async (acc, spot) => {
                    acc[spot.id] = spot;

                    let difficult = Math.random() < 0.2;
                    let type_chance = Math.random(); 
                    let type = '';              
                    switch (type_chance){
                        case type_chance < 0.1:
                            type = "Handicapped";
                            break;
                        case type_chance < 0.2:
                            type = "ECharging";
                            break;
                        default:
                            type ='Regular';
                    }

                    let now = new Date();
                        
                    let ISOformat = now.toISOString();

                    const upsertSpot = await prisma.spot.upsert({
                        where: {
                            id: spot.id,
                        },
                        update: {
                            occupied: spot.occupied,
                        },
                        create: {
                            id: uuid.v4(),
                            latitude: String(spot.latitude),
                            longitude: String(spot.longitude),
                            occupied: spot.occupied,
                            occupiedTimestamp: ISOformat,
                            difficult,
                            type,
                            parkingSpotZone: spot.parkingSpotZone,
                        },
                    })

                    return acc;
                }, {});
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        
    }

    // startBackup() {
    //     setInterval(() => {
    //         global.waitingBackup = True

    //         .then((response) => {
    //             if (response.data.error) {
    //             console.error(response.data.error);
    //             }
    //             console.log(response.data);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });

    //         global.waitingBackup = false;
    //     }, 1000);
    // }
}

module.exports = Cron;