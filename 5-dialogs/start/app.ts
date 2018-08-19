import * as restify from 'restify';
import { MemoryBotStorage, UniversalBot, ChatConnector, LuisRecognizer } from 'botbuilder';
import { BotServiceConnector } from 'botbuilder-azure';
import { CreateReservationDialog } from "./dialogs/create-reservation-dialog";
import { CONSTANTS } from './constants';

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
    session.endDialog('Sorry, I don\'t understand.  I only know how to make restaurant reservations.');
});

// Set storage to Bot
bot.set('storage', new MemoryBotStorage());

const luisAppId = process.env.LuisAppId;
const luisAPIKey = process.env.LuisAPIKey;
const luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
const recognizer = new LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

bot.dialog('CreateReservationDialog', CreateReservationDialog)
   .triggerAction({ matches: CONSTANTS.intents.CREATE_RESERVATION });

// Create restify server
const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));