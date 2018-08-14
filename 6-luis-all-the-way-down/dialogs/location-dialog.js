var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');

module.exports = new builder.WaterfallDialog([
    (session, args, next) => {
        var reservation = session.privateConversationData.reservation;

        if (reservation.location) {
            restaurantService.hasRestaurants(reservation.location).then((hasResaurants) => {
                if (hasResaurants) {
                    session.endDialogWithResult({ response: reservation.location });
                } else {
                    session.send(constants.messages.LOCATION_UNRECOGNIZED);
                }
            });
        } else {
            builder.Prompts.text(session, args && args.reprompt ? args.msg : constants.messages.LOCATION_REQUEST);
        }
    },
    (session, results, next) => {
        var location = results.response;

        var reservation = session.privateConversationData.reservation;

        restaurantService.hasRestaurants(location).then((hasResaurants) => {
            if (hasResaurants) {
                // Update private conversation data
                reservation.location = location;

                // Send confirmation message
                session.send(util.format(constants.messages.LOCATION_CONFIRMATION, location));
                session.endDialogWithResult({ response: location })

            } else {
                // Reprompt the dialog
                session.replaceDialog('LocationDialog', { reprompt: true,  msg: constants.messages.LOCATION_UNRECOGNIZED });
            }
        });
    }
]);