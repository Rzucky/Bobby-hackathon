const {EventHubConsumerClient, latestEventPosition} = require("@azure/event-hubs");
const {createServer} = require('http');
const {Server} = require('socket.io');
const express = require('express');

const cors = require("cors");
/*
    Explanation:
    - EventHubConsumerClient is used to consume events from an Event Hub.
    - latestEventPosition is used to start receiving events from the moment of calling subscribe. (This will prevent getting past events.)
    - if you are more familiar with Kafka, you can also use Kafka client to consume events from Event Hub, but it is not recommended.
 */
const connectionString = "Endpoint=sb://cbq-hackathon.servicebus.windows.net/;SharedAccessKeyName=n;SharedAccessKey=Zts2uk64HSb2Fr+SXp4S0THjMpp8v+zI9+AEhI29rH4=;EntityPath=team7";
const eventHubName = "team7";
const consumerGroup = "$Default";

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
// Import express

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

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
