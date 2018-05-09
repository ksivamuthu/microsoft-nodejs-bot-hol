var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');
var _ = require('lodash');
var moment = require('moment');
var Restaurant = require('../restaurants/restaurant.model');

module.exports = new builder.WaterfallDialog([
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        sendConfirmationMessage(session, constants.messages.RESERVATION_CONFIRMATION, reservation);

        function sendConfirmationMessage(session, prompt, reservation) {
            var when = moment(reservation.when);
            var restaurant = Restaurant.fromJson(reservation.restaurant);

            var card = new builder.HeroCard(session)
                .title(`${restaurant.name} (${reservation.partySize})`)
                .subtitle(when.format('LLLL'))
                .text(`${restaurant.address}`)
                .images([builder.CardImage.create(session, restaurant.logourl)])
                .buttons([builder.CardAction.imBack(session, 'Reserve', 'Reserve')]);

            var msg = new builder.Message(session)
                .text(prompt)
                .attachments([card.toAttachment()]);

            var retryPrompt = new builder.Message(session)
                .text(constants.messages.CONFIRMATION_UNRECOGNIZED)
                .attachments([card.toAttachment()]);

            builder.Prompts.choice(session, msg, 'Reserve', { retryPrompt: retryPrompt });
        }
    },
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;

        if (results.response.entity === 'Reserve') {
            session.endDialogWithResult({ response: reservation });
        }
    }
]);