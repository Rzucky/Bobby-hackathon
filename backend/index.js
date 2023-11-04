const {EventHubConsumerClient, latestEventPosition} = require("@azure/event-hubs");
const {createServer} = require('http');
const {Server} = require('socket.io');
const express = require('express');

const {PrismaClient} = require('@prisma/client');
const authenticationRoutes = require('./routes/authentication');
const prisma = new PrismaClient();

require("dotenv").config();
const cors = require("cors");
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
            console.log(`Received events: ${events.length}`);

            if (events.length === 0) {
                console.log(`No events received within wait time. Waiting for next interval`);
                return;
            }

            for (const event of events) {
                console.table(event.body)

                io.emit('ps', event.body);
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
// Initialize the express application
const app = express();
app.use(cors({
    origin: '*',
}));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
// Define a route for GET requests to '/'
app.get('/', (req, res) => {
    // Send 'Hello World' response
    res.send('Hello World');
});


app.get('/test_insert', async (req, res) => {
    const user = await prisma.user.create({
        data: {
            type: 'user',
            name: 'Bobby',
            email: 'bobby@tablice.drop'
        },
    })
    console.log(user)
    try {
        await prisma.$disconnect()
    } catch (error) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    }
})

app.use('/api/auth', authenticationRoutes);

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

module.exports = {
    prisma
}
