const {EventHubConsumerClient, latestEventPosition} = require("@azure/event-hubs");
const {createServer} = require('http');
const {Server} = require('socket.io');
const {PrismaClient} = require("@prisma/client");
const {parseTime, sendReservationRequest, Time, persistReservationHistory, getCurrentTime, calculateTimeDifferenceWithPrice} = require("./util");
const prisma = new PrismaClient()
/*
    Explanation:
    - EventHubConsumerClient is used to consume events from an Event Hub.
    - latestEventPosition is used to start receiving events from the moment of calling subscribe. (This will prevent getting past events.)
    - if you are more familiar with Kafka, you can also use Kafka client to consume events from Event Hub, but it is not recommended.
 */
class EventHub {
    constructor() {

        console.log(getCurrentTime())
        const connectionString = process.env.CONNECTION_STRING;
        const eventHubName = process.env.EVENT_HUB_NAME;
        const consumerGroup = process.env.CONSUMER_GROUP;
        
        const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

        this.startSubscription(consumerClient);

        this.startIOServer();

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

    async startSubscription(consumerClient) {
        await this.waitForVariable();
        const subscription = consumerClient.subscribe({
                /*
                    Explanation:
                    - processEvents is called whenever the consumer client receives events.
                    - it will always receive a batch of events, even if there is only 1 event in the batch.
                    - events will always come in order they were sent to Event Hub by the producer(simulation).
                    - at end of processEvents, you need to update the checkpoint/offset to the latest event (to prevent processing past events).
                */
                processEvents: async (events, context) => {
                    console.log(`Received events: ${events.length}`);
        
                    if (events.length === 0) {
                        console.log(`No events received within wait time. Waiting for next interval`);
                        return;
                    }

                    let reservations = await prisma.reservation.findMany({
                        where: {
                            parkingSpotId: {
                                in: events.map(event => event.body.Id)
                            }
                        }
                    })

                    reservations = reservations.reduce((acc, spot) => {
                        acc[spot.parkingSpotId] = spot;
                        return acc;
                    }, {});
                    
                    for (const event of events) {
                        console.table(event.body.Id)
                        //if got freed and we have that id in reservations
                        if ((!event.body.IsOccupied) && event.body.Id in reservations) {
                            console.log("ReReservation for id" + event.body.Id)
                            let reservation = reservations[event.body.Id]
                            let now = getCurrentTime()
                            let end = parseTime(reservation.endTime)
                            if (now.diffHours(end) >= 0) {
                                //delete reservation
                                persistReservationHistory(prisma, reservation.userId, reservation.parkingSpotId, event.body.Time, false)
                                await prisma.reservation.deleteMany({
                                    where: {
                                        id: reservation.id
                                    }
                                })

                                const reservations = await prisma.reservationHistory.findMany({
                                    where: {
                                        userId: reservation.userId,
                                        parkingSpotId: reservation.parkingSpotId
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
                    
                                const calcs = calculateTimeDifferenceWithPrice(times)
                                
                                await prisma.debt.create({
                                    data: {
                                        userId: reservation.userId,
                                        amount: calcs.price
                                    },
                                })
                                continue;
                            }
                            let endHours = now.addHours(2).hours
                            if (end.diffHours(now.addHours(2)) < 2){
                                endHours = end.hours
                            }

                            sendReservationRequest(event.body.Id, endHours, 0).then(response => {
                                console.log("Extended reservation for id" + event.body.Id)
                                persistReservationHistory(prisma,reservation.userId , reservation.parkingSpotId, event.body.Time, true)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        }
                        else {
                            console.log("Kafka user change")
                            persistReservationHistory(prisma, -1, event.body.Id, event.body.Time, event.body.IsOccupied)
                        }

                        global.parkingSpots[event.body.Id].occupied = event.body.IsOccupied;
                        let time = getCurrentTime()
                        // let hours = parseInt(time.split(":")[0])
                        // let minutes = parseInt(time.split(":")[1])
                         // console.log(global.time.getTime(), getCurrentTime().getTime())

                        let now = new Date();


                        // Set the hours and minutes to the current date
                        now.setHours(time.hours, time.minutes, 0, 0);

                        // Convert to ISO 8601 format
                        let ISOformat = now.toISOString();

                        let type_chance = Math.random();
                        let type = '';                  
                        switch (type_chance){
                            case type_chance < 0.1:
                                type = "Handicapped";
                                break;
                            case type_chance < 0.2:
                                type = "ECharging";
                                break;
                            case type_chance < 0.3:
                                type = "Family";
                                break;
                            default:
                                type = 'Regular'
                        }

                        let data_object = {
                            id: event.body.Id,
                            latitude: String(global.parkingSpots[event.body.Id].latitude),
                            longitude: String(global.parkingSpots[event.body.Id].longitude),
                            occupied: event.body.IsOccupied ?? false,
                            occupiedTimestamp: String(ISOformat),
                            difficult: Math.random() < 0.2,
                            type,
                            parkingSpotZone: global.parkingSpots[event.body.Id].parkingSpotZone,
                        }

                        const upsertSpot = await prisma.spot.upsert({
                            where: {
                                id: event.body.Id,
                            },
                            update: {
                                occupied: event.body.IsOccupied,
                            },
                            create: data_object,
                        })

                        data_object.price = global.zoneStats[data_object.parkingSpotZone].price
                        data_object["24h_stats"] = global.spotStats[data_object.id]?.totalReservations ?? 0; 

                        this.io.emit('ps', data_object);
                    }
        
                    await context.updateCheckpoint(events[events.length - 1]);
                },
        
                processError: async (err) => {
                    console.log(`Error : ${err}`);
                }
            },
            {startPosition: latestEventPosition}
        ); 
        console.log("subscription setup done", subscription.isRunning);
    }
    
 
    startIOServer() {
        const server = createServer(global.app);
        const io = new Server(server, {
            cors: {
                origin: '*',
            }
        });
        this.io = io
        
        io.on('connection', (socket) => {
            console.log('a user connected');
        });
    }
}

module.exports = EventHub;
