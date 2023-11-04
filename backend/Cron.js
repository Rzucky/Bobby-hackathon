
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const uuid = require('uuid')
const axios = require('axios')
class Cron {
    constructor() {
        this.startup();
        // global.waitingBackup = false;
        // this.startBackup();

        // this.calculateStats();
        this.insertCache()
    }

    async startup() {
        global.readyAfterStartup = false
        try {
            let parkingSpots = await axios.get(global.config.PARKING_API + '/api/ParkingSpot/getAll', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Api-Key': global.config.API_KEY
                }
            })

            // console.log(parkingSpots)


            if(parkingSpots.status != 200){

                throw new Error('Network response was not ok ');
            }

            let spotsAccumulator = {};
  
            for (const spot of parkingSpots.data) {
              spotsAccumulator[spot.id] = spot;
            }
            
            global.parkingSpots = spotsAccumulator;
        } catch (error) {

            console.error('There has been a problem with your fetch operation:', error);
        }

            // .then(response => {
            //     if (!response.ok) {
            //     }
            //     return response.json();
            // })
            // .then(pSpots => {
            //     global.parkingSpots = pSpots.reduce(async (acc, spot) => {
            //         acc[spot.id] = spot;

            //         let difficult = Math.random() < 0.2;
            //         let type_chance = Math.random(); 
            //         let type = '';              
            //         switch (type_chance){
            //             case type_chance < 0.1:
            //                 type = "Handicapped";
            //                 break;
            //             case type_chance < 0.2:
            //                 type = "ECharging";
            //                 break;
            //             default:
            //                 type ='Regular';
            //         }

            //         let now = new Date();
                        
            //         let ISOformat = now.toISOString();

            //         const upsertSpot = await prisma.spot.upsert({
            //             where: {
            //                 id: spot.id,
            //             },
            //             update: {
            //                 occupied: spot.occupied,
            //             },
            //             create: {
            //                 id: uuid.v4(),
            //                 latitude: String(spot.latitude),
            //                 longitude: String(spot.longitude),
            //                 occupied: spot.occupied,
            //                 occupiedTimestamp: ISOformat,
            //                 difficult,
            //                 type,
            //                 parkingSpotZone: spot.parkingSpotZone,
            //             },
            //         })
            //         console.log(spot.id)
            //         return acc;
            //     }, {});
            // })
            // .catch(error => {
            //     console.error('There has been a problem with your fetch operation:', error);
            // });

            global.readyAfterStartup = true
    }

    waitForVariable() {
        return new Promise((resolve) => {
        // Check every 100 milliseconds
        const intervalId = setInterval(() => {
            if (global.readyAfterStartup) {
            clearInterval(intervalId); // Stop checking
            resolve(); // Resolve the promise
            }
        }, 1000);
        });
    }

    async insertCache() {
        await this.waitForVariable()

        for(const spot_id in global.parkingSpots) {
              const spot = global.parkingSpots[spot_id]

              let difficult = Math.random() < 0.2;
              let type_chance = Math.random();
              let type = 'Regular'; // Default type
          
              if (type_chance < 0.1) {
                type = "Handicapped";
              } else if (type_chance < 0.2) {
                type = "ECharging";
              }
          
              let now = new Date();
              let ISOformat = now.toISOString();
          
              try {
                const upsertSpot = await prisma.spot.upsert({
                  where: { id: spot.id },
                  update: { occupied: spot.occupied },
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
                });

              } catch (error) {
                console.error(`Failed to upsert spot with ID ${spot.id}:`, error);
              }
            }
            console.log('\n\n\n\n\n\n\nFINISHED\n\n\n\n\n\n\n\n')
    }

    // calculateStats() {
    //     const zoneStats = {};

    //     // Initialize counters for each zone
    //     for (const zone of ['Zone1', 'Zone2', 'Zone3', 'Special']) {
    //         zoneStats[zone] = { totalSpots: 0, occupiedSpots: 0 };
    //     }

    //     // Count occupied and total spots per zone
    //     spots.forEach(spot => {
    //         if (zoneStats[spot.parkingSpotZone]) {
    //         zoneStats[spot.parkingSpotZone].totalSpots++;
    //         if (spot.occupied) {
    //             zoneStats[spot.parkingSpotZone].occupiedSpots++;
    //         }
    //         }
    //     });

    //     // Calculate remaining spots and occupancy percentage
    //     const results = {};
    //     Object.keys(zoneStats).forEach(zone => {
    //         const total = zoneStats[zone].totalSpots;
    //         const occupied = zoneStats[zone].occupiedSpots;
    //         const remaining = total - occupied;
    //         const occupancyPercentage = (occupied / total) * 100;

    //         results[zone] = {
    //         remainingSpots: remaining,
    //         occupancyPercentage: occupancyPercentage.toFixed(2) // formatted to 2 decimal places
    //         };
    //     });
    // }

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