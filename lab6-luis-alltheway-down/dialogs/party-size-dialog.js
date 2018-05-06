var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');
var wordsToNum = require('words-to-numbers').wordsToNumbers;

module.exports = new builder.WaterfallDialog([
    (session, args, next) => {
        var reservation = session.privateConversationData.reservation;
        if (reservation.partySize) {
            session.endDialogWithResult({ response: reservation.partySize });
        } else {
            builder.Prompts.text(session, args && args.reprompt ? args.msg : constants.messages.PARTY_REQUEST);
        }
    },
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        var partySize = parseInt(wordsToNum(results.response));

        if (partySize) {
            reservation.partySize = partySize;
            session.send(constants.messages.CONFIRMATION);
            session.endDialogWithResult({ response: reservation.partySize });
        } else {
            session.replaceDialog('PartySizeDialog', { reprompt: true, msg: constants.messages.PARTY_UNRECOGNIZED });
        }
    }
]);