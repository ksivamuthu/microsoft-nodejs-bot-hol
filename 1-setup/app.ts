require('dotenv').config();

import * as restify from 'restify';
import bot from './bot';
import { BotServiceConnector } from './node_modules/botbuilder-azure';

class App {
    run() {
        const server = restify.createServer();
        server.post('/api/messages', (bot.connector('*') as BotServiceConnector ).listen());
        server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));
    }
}

const app = new App();
app.run();