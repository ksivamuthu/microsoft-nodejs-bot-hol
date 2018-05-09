"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var constants = require('./constants');
var _ = require('lodash');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.

var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send(constants.messages.NONE);
});

// Set inMemory Storage
var inMemoryStorage = new builder.MemoryBotStorage();
bot.set('storage', inMemoryStorage);

bot.localePath(path.join(__dirname, './locale'));

// Add LUIS
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

bot.recognizer({
    recognize: function (context, done) {
        var intent = { score: 0.0 };
        var values = ['cancel', 'nevermind', 'never mind', 'forget it', 'forgetit'];

        if (context.message.text) {
            if (_.some(values, (x) => x.toLowerCase() === context.message.text.toLowerCase())) {
                intent = { score: 1.0, intent: 'EndConversation' };
            }
        }
        done(null, intent);
    }
});

// Create Reservation Dialog
bot.dialog('CreateReservationDialog', require('./dialogs/create-reservation-dialog'))
    .triggerAction({
        matches: [
            constants.intents.CREATE_RESERVATION, constants.intents.SET_RESERVATION_CUISINE,
            constants.intents.SET_RESERVATION_DATE, constants.intents.SET_RESERVATION_LOCATION,
            constants.intents.SET_RESERVATION_PARTY_SIZE
        ]
    });

bot.dialog('LocationDialog', require('./dialogs/location-dialog'));
bot.dialog('CuisineDialog', require('./dialogs/cuisine-dialog'));
bot.dialog('RestaurantDialog', require('./dialogs/restaurant-dialog'));
bot.dialog('WhenDialog', require('./dialogs/when-dialog'));
bot.dialog('PartySizeDialog', require('./dialogs/party-size-dialog'));
bot.dialog('ConfirmReservationDialog', require('./dialogs/confirm-reservation-dialog'));
bot.dialog('CancelDialog', require('./dialogs/end-conversation-dialog')).triggerAction({ matches: 'EndConversation' });

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function () {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = connector.listen();
}
