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

// User and Conversation Events
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
      console.log('Members added', message.address);
    } else if(message.membersRemoved) {
      console.log('Members removed', message.address);
    }
});

bot.on('contactRelationUpdate', function(message) {
    console.log('Bot added/removed ' + message);
});

bot.on('typing', function(message){
  console.log('Typing ' + message);
});

bot.on('ping', function(message){
    console.log('pong ' + message);
});

// Greetings Dialog
bot.dialog('GreetingsDialog', [
    function (session, results) {
        var text = session.message.text;
        // Count the text length and send it back
        session.endDialog(`You sent \"${text}\" which was ${text.length} characters`);
    }
]);

module.exports = connector.listen();
