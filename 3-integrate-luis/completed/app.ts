// Load .env files as process variables
import * as dotenv from 'dotenv';
dotenv.config();

import { ChatConnector, LuisRecognizer, MemoryBotStorage, UniversalBot } from 'botbuilder';
import * as restify from 'restify';
import { CONSTANTS } from './constants';
import { CreateReservationDialog } from "./dialogs/create-reservation-dialog";

// Construct connector
const connector =  new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
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

const luisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
const recognizer = new LuisRecognizer(luisModelUrl);
bot.recognizer(recognizer);

bot.dialog('CreateReservationDialog', CreateReservationDialog)
   .triggerAction({ matches: CONSTANTS.intents.CREATE_RESERVATION });

// Create restify server
const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT || 3978, () => console.log(`${server.name} listening to ${server.url}`));