const Routing = require("./routes/Routing");
const Cron = require("./Cron");
const EventHub = require("./EventHub");

require("dotenv").config();

class Start {
  constructor() {
    global.config = process.env;
    // global.logger = new Logger();
    const routing = new Routing();
    routing.start();
    const event_hub = new EventHub();
    const cron = new Cron();
  }
}

new Start();
