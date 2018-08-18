"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const botbuilder_1 = require("botbuilder");
const botbuilder_azure_1 = require("botbuilder-azure");
require('dotenv').config();
const useEmulator = (process.env.NODE_ENV == 'development');
const connector = useEmulator ? new botbuilder_1.ChatConnector() : new botbuilder_azure_1.BotServiceConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new botbuilder_1.UniversalBot(connector, (session, _args) => {
    const text = session.message.text;
    session.endDialog(`You sent '${text}' which was ${text.length} characters`);
});
bot.set('storage', new botbuilder_1.MemoryBotStorage());
const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));
//# sourceMappingURL=app.js.map