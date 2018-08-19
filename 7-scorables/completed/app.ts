// Load .env files as process variables
require('dotenv').config();

import * as restify from 'restify';
import { MemoryBotStorage, UniversalBot, ChatConnector, LuisRecognizer } from 'botbuilder';
import { BotServiceConnector } from 'botbuilder-azure';
import { ConfirmReservationDialog } from "./dialogs/confirm-reservation-dialog";
import { CreateReservationDialog } from "./dialogs/create-reservation-dialog";
import { CuisineDialog } from "./dialogs/cuisine-dialog";
import { LocationDialog } from "./dialogs/location-dialog";
import { PartySizeDialog } from "./dialogs/party-size-dialog";
import { RestaurantDialog } from "./dialogs/restaurant-dialog";
import { WhenDialog } from "./dialogs/when-dialog";
import { CONSTANTS } from './constants';
import _ = require('lodash');

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
bot.recognizer({
    recognize: function (context, done) {
        let err: Error | undefined;
        let intent = { score: 0.0, intent: '' };
        const values = ['cancel', 'nevermind', 'never mind', 'forget it', 'forgetit'];

        if (context.message.text) {
            if (_.some(values, (x) => x.toLowerCase() === context.message.text!.toLowerCase())) {
                intent = { score: 1.0, intent: 'EndConversation' };
            }
        }
        done(err!, intent);
    }
});

bot.dialog('CreateReservation', CreateReservationDialog)
   .triggerAction({ matches: [
    CONSTANTS.intents.CREATE_RESERVATION, CONSTANTS.intents.SET_RESERVATION_CUISINE,
    CONSTANTS.intents.SET_RESERVATION_DATE, CONSTANTS.intents.SET_RESERVATION_LOCATION,
    CONSTANTS.intents.SET_RESERVATION_PARTY_SIZE
]});
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