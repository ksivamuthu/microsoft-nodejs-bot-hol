var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');
var moment = require('moment');

module.exports = new builder.WaterfallDialog([
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        if (reservation.when) {
            session.endDialogWithResult({ response: reservation.when });
        } else {
            builder.Prompts.time(session, constants.messages.WHEN_REQUEST, { retryPrompt: constants.messages.WHEN_UNRECOGNIZED });
        }
    },
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        var when = builder.EntityRecognizer.resolveTime([results.response]);
        if (when) {
            reservation.when = when;

            session.send(constants.messages.WHEN_CONFIRMATION, reservation.restaurant.name, moment(when).format('LLLL'));

            session.endDialogWithResult({ response: reservation.when });
        }
    }
]);