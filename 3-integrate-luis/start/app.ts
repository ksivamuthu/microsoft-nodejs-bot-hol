// Load .env files as process variables
import * as dotenv from 'dotenv';
dotenv.config();

import * as restify from 'restify';
import { MemoryBotStorage, UniversalBot, ChatConnector } from 'botbuilder';

// Construct connector
const connector =  new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
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