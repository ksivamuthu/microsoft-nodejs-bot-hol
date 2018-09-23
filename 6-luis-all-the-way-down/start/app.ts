// Load .env files as process variables
import * as dotenv from "dotenv";
dotenv.config();

import { ChatConnector, LuisRecognizer, MemoryBotStorage, UniversalBot } from "botbuilder";
import * as restify from "restify";
import { CONSTANTS } from "./constants";
import { ConfirmReservationDialog } from "./dialogs/confirm-reservation-dialog";
import { CreateReservationDialog } from "./dialogs/create-reservation-dialog";
import { CuisineDialog } from "./dialogs/cuisine-dialog";
import { LocationDialog } from "./dialogs/location-dialog";
import { PartySizeDialog } from "./dialogs/party-size-dialog";
import { RestaurantDialog } from "./dialogs/restaurant-dialog";
import { WhenDialog } from "./dialogs/when-dialog";

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
bot.dialog('LocationDialog', LocationDialog);
bot.dialog('CuisineDialog', CuisineDialog);
bot.dialog('RestaurantDialog', RestaurantDialog);
bot.dialog('WhenDialog', WhenDialog);
bot.dialog('PartySizeDialog', PartySizeDialog);
bot.dialog('ConfirmReservationDialog', ConfirmReservationDialog);

// Create restify server
const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));