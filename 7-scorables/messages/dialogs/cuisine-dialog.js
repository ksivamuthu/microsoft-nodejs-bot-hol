var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');
var _ = require('lodash');

module.exports = new builder.WaterfallDialog([
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;

        if (reservation.cuisine) {
            restaurantService.hasRestaurantsWithCuisine(reservation.location, reservation.cuisine).then((hasRestaurants) => {
                if (hasRestaurants) {
                    session.endDialogWithResult({ response: reservation.cuisine });
                } else {
                    session.send(util.format(constants.messages.CUISINE_UNRECOGNIZED, reservation.cuisine));
                }
            });
        } else {
            sendCuisineSelectionMessage(session, constants.messages.CUISINE_REQUEST, reservation);
        }

        function sendCuisineSelectionMessage(session, prompt, reservation) {
            return restaurantService.getCuisines(reservation.location).then((cuisines) => {

                var cardActions = _.map(cuisines, (x) => {
                    return builder.CardAction.imBack(session, x.name, `${x.name} (${x.count})`);
                });

                var choices = _.map(cuisines, (x) => { return x.name; });
                var suggestedActions = builder.SuggestedActions.create(session, cardActions);

                var msg = new builder.Message(session)
                    .text(prompt)
                    .suggestedActions(suggestedActions);

                builder.Prompts.choice(session, msg, choices);
            });
        }
    },
    (session, results, next) => {

        var reservation = session.privateConversationData.reservation;
        var cuisine = results.response && results.response.entity;

        if (cuisine) {
            restaurantService.hasRestaurantsWithCuisine(reservation.location, cuisine).then((hasRestaurants) => {
                if (hasRestaurants) {
                    // Update private conversation data
                    reservation.cuisine = cuisine;

                    // Send confirmation message
                    session.send(constants.messages.CUISINE_CONFIRMATION);

                    session.endDialogWithResult({ response: reservation.cuisine });

                } else {
                    session.send(util.format(constants.messages.CUISINE_UNRECOGNIZED, cuisine));
                }
            });
        }
    }
]);