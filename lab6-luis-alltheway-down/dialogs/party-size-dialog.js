var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');
var wordsToNum = require('words-to-numbers').wordsToNumbers;

module.exports = new builder.WaterfallDialog([
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        if (reservation.partySize) {
            session.endDialogWithResult({ response: reservation.partySize });
        } else {
            builder.Prompts.text(session, constants.messages.PARTY_REQUEST);
        }
    },
    (session, results, next) => {
        builder.Prompt.Re
        var reservation = session.privateConversationData.reservation;
        var partySize = parseInt(results.response) || wordsToNum(results.response);

        if (partySize) 
        {
            reservation.partySize = partySize;
            session.send(constants.messages.CONFIRMATION);
            session.endDialogWithResult({ response: reservation.partySize });
        }
    }
]);