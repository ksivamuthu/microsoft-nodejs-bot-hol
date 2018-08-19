import * as restify from 'restify';
import { MemoryBotStorage, UniversalBot, ChatConnector } from 'botbuilder';
import { BotServiceConnector } from 'botbuilder-azure';

// Load .env files as process variables
require('dotenv').config();

const useEmulator = (process.env.NODE_ENV == 'development');

// Construct connector
const connector =  useEmulator ? new ChatConnector() : new BotServiceConnector ({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Construct Bot
const bot = new UniversalBot(connector, (session, _args) => {
    const text = session.message.text!
    // Count the text length and send it back
    session.endDialog(`You sent '${text}' which was ${text.length} characters`);
});

// Set storage to Bot
bot.set('storage', new MemoryBotStorage());

// Create restify server
const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));