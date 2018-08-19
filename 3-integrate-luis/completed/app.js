"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const botbuilder_1 = require("botbuilder");
const botbuilder_azure_1 = require("botbuilder-azure");
const create_reservation_dialog_1 = require("./dialogs/create-reservation-dialog");
const constants_1 = require("./constants");
require('dotenv').config();
const useEmulator = (process.env.NODE_ENV == 'development');
const connector = useEmulator ? new botbuilder_1.ChatConnector() : new botbuilder_azure_1.BotServiceConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new botbuilder_1.UniversalBot(connector, (session, _args) => {
    session.endDialog('Sorry, I don\'t understand.  I only know how to make restaurant reservations.');
});
bot.set('storage', new botbuilder_1.MemoryBotStorage());
const luisAppId = process.env.LuisAppId;
const luisAPIKey = process.env.LuisAPIKey;
const luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;
const recognizer = new botbuilder_1.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);
bot.dialog('CreateReservationDialog', create_reservation_dialog_1.CreateReservationDialog)
    .triggerAction({ matches: constants_1.CONSTANTS.intents.CREATE_RESERVATION });
const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));
//# sourceMappingURL=app.js.map