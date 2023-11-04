const {EventHubConsumerClient, latestEventPosition} = require("@azure/event-hubs");
// const {createServer} = require('http');
// const {Server} = require('socket.io');

require("dotenv").config();

const {PrismaClient} = require('../node_modules/@prisma/client');

const parkingSpotsRoutes = require('./routes/parkingSpots');

const prisma = new PrismaClient();
const bodyParser = require('body-parser')

const cors = require("cors");
const Routing = require("./routes/Routing");
/*
    Explanation:
    - EventHubConsumerClient is used to consume events from an Event Hub.
    - latestEventPosition is used to start receiving events from the moment of calling subscribe. (This will prevent getting past events.)
    - if you are more familiar with Kafka, you can also use Kafka client to consume events from Event Hub, but it is not recommended.
 */
const connectionString = process.env.CONNECTION_STRING;
const eventHubName = process.env.EVENT_HUB_NAME;
const consumerGroup = process.env.CONSUMER_GROUP;

const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

const subscription = consumerClient.subscribe({

        /*
            Explanation:
            - processEvents is called whenever the consumer client receives events.
            - it will always receive a batch of events, even if there is only 1 event in the batch.
            - events will always come in order they were sent to Event Hub by the producer(simulation).
            - at end of processEvents, you need to update the checkpoint/offset to the latest event (to prevent processing past events).
         */
        processEvents: async (events, context) => {
            // console.log(`Received events: ${events.length}`);

            if (events.length === 0) {
                console.log(`No events received within wait time. Waiting for next interval`);
                return;
            }

            for (const event of events) {
                // console.table(event.body)
                global.parkingSpots[event.body.Id].occupied = event.body.IsOccupied;
                let time = event.body.Time
                let hours = time.split(":")[0]
                let minutes = time.split(":")[1]

                global.hours = hours
                global.minutes = minutes

                // io.emit('ps', event.body);
            }

            await context.updateCheckpoint(events[events.length - 1]);
        },

        processError: async (err, context) => {
            console.log(`Error : ${err}`);
        }
    },
    {startPosition: latestEventPosition}
);

console.log("subscription setup done", subscription.isRunning);

// const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*',
//     }
// });


// io.on('connection', (socket) => {
//     console.log('a user connected');
// });


class Start {
    constructor() {
        global.config = process.env
        // global.logger = new Logger();
        const routing = new Routing();
        routing.start()

      }


}

new Start();


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
        global.parkingSpots = pSpots.reduce((acc, spot) => {
            acc[spot.id] = spot;
            return acc;
        }, {});
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

module.exports = {
    prisma
}
