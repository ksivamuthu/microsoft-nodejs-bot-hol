"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const restify = require("restify");
const bot_1 = require("./bot");
class App {
    run() {
        const server = restify.createServer();
        server.post('/api/messages', bot_1.default.connector('*').listen());
        server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));
    }
}
const app = new App();
app.run();
