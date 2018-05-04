var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');
var _ = require('lodash');

module.exports = new builder.WaterfallDialog([
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;

        if (!reservation.cuisine) {
            var prompt = util.format(constants.messages.CUISINE_REQUEST);
            sendCuisineSelectionMessage(session, prompt, reservation);
        } else {
            session.beginDialog('RestaurantDialog');
        }

        function sendCuisineSelectionMessage(session, prompt, reservation) {
            return restaurantService.getCuisines(reservation.location).then((cuisines) => {
                var cardActions = _.map(cuisines, (x) => {
                    return builder.CardAction.imBack(session, x.name , `${x.name} (${x.count})`);                
                });

                var choices = _.map(cuisines, (x) => {
                    return x.name;
                });

                var msg = new builder.Message(session)
                    .text(prompt)
                    .suggestedActions(
                        builder.SuggestedActions.create(
                            session, cardActions
                        ));
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
    
                    session.beginDialog('RestaurantDialog');
    
                    return;
                } else {
                    session.send(util.format(constants.messages.CUISINE_UNRECOGNIZED, cuisine));
                }
            });            
        }
        next();
    }
]);