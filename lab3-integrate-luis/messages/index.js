"use strict";

require('dotenv').config();
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var connector = new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.

var bot = new builder.UniversalBot(connector, function (session, args) {
    
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


// Create Reservation Dialog
bot.dialog('CreateReservationDialog',
    [(session, args, next) => {
        var intent = args.intent;
        var locationKey = 'RestaurantReservation.Address';
        var cuisineKey = 'RestaurantReservation.Cuisine';
        var whenKey = 'builtin.datetimeV2.datetime';
        var partySizeKey = 'builtin.number';

        var location = builder.EntityRecognizer.findEntity(intent.entities, locationKey);
        var cuisine = builder.EntityRecognizer.findEntity(intent.entities, cuisineKey);
        var when = builder.EntityRecognizer.findEntity(intent.entities, whenKey);
        var partySize = builder.EntityRecognizer.findEntity(intent.entities, partySizeKey);

        session.privateConversationData.reservation = {
            location: location ? location.entity : null,
            cuisine: cuisine ? cuisine.entity : null,
            when: when ? when.entity : null,
            partySize: partySize ? partySize.entity : null
        };

        next();
    },
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        if (reservation != null) {
            if (reservation.location) {
                session.send(`Location Preference: ${reservation.location}`);
            }

            if (reservation.cuisine) {
                session.send(`Cuisine Preference: ${reservation.cuisine}`);
            }

            if (reservation.when) {
                session.send(`Date Preference: ${reservation.when}`);
            }

            if (reservation.partySize) {
                session.send(`Party Size Preference: ${reservation.partySize}`);
            }
        }
        next();
    }]
).triggerAction({
    matches: 'Create Reservation'
});

module.exports = connector.listen();
