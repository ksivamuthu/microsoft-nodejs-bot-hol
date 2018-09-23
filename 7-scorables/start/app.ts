// Load .env files as process variables
import * as dotenv from "dotenv";
dotenv.config();

import * as restify from 'restify';
import { MemoryBotStorage, UniversalBot, ChatConnector, LuisRecognizer, Prompts, PromptType, PromptAttachment, PromptChoice, PromptConfirm, PromptNumber, PromptText, PromptTime, Session } from 'botbuilder';
import { ConfirmReservationDialog } from "./dialogs/confirm-reservation-dialog";
import { CreateReservationDialog } from "./dialogs/create-reservation-dialog";
import { CuisineDialog } from "./dialogs/cuisine-dialog";
import { LocationDialog } from "./dialogs/location-dialog";
import { PartySizeDialog } from "./dialogs/party-size-dialog";
import { RestaurantDialog } from "./dialogs/restaurant-dialog";
import { WhenDialog } from "./dialogs/when-dialog";
import { CONSTANTS } from './constants';

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

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
const recognizer = new LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

const dialogMatches = [
    CONSTANTS.intents.CREATE_RESERVATION, CONSTANTS.intents.SET_RESERVATION_CUISINE,
    CONSTANTS.intents.SET_RESERVATION_DATE, CONSTANTS.intents.SET_RESERVATION_LOCATION,
    CONSTANTS.intents.SET_RESERVATION_PARTY_SIZE
];

const luisPromptHandler = (session:Session, args:any) => {
    session.cancelDialog(0);
    session.beginDialog('CreateReservation', { intent: args });
};

// Customize Prompts
Prompts.customize(PromptType.attachment, new PromptAttachment().recognizer(recognizer).matchesAny(dialogMatches, luisPromptHandler));
Prompts.customize(PromptType.choice, new PromptChoice().recognizer(recognizer).matchesAny(dialogMatches, luisPromptHandler));
Prompts.customize(PromptType.confirm, new PromptConfirm().recognizer(recognizer).matchesAny(dialogMatches, luisPromptHandler));
Prompts.customize(PromptType.number, new PromptNumber().recognizer(recognizer).matchesAny(dialogMatches, luisPromptHandler));
Prompts.customize(PromptType.text, new PromptText().recognizer(recognizer).matchesAny(dialogMatches, luisPromptHandler));
Prompts.customize(PromptType.time, new PromptTime().recognizer(recognizer).matchesAny(dialogMatches, luisPromptHandler));

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
server.listen(process.env.PORT || 3978, () => console.log(`${server.name} listening to ${server.url}`));