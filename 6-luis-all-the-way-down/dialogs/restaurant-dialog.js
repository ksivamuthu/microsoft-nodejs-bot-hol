var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');
var _ = require('lodash');


module.exports = new builder.WaterfallDialog([
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;

        var prompt = util.format(constants.messages.RESTAURANT_REQUEST, reservation.cuisine, reservation.location);
        sendRestaurantSelectionMessage(session, prompt, reservation);

        function sendRestaurantSelectionMessage(session, prompt, reservation) {

            return restaurantService.getRestaurants(reservation.location, reservation.cuisine)
                .then((restaurants) => {
                    if (restaurants && restaurants.length > 0) {
                        var cardAttachments = _.map(restaurants, (restaurant) => {
                            var card = new builder.ThumbnailCard(session)
                                .title(restaurant.name)
                                .subtitle(restaurant.address)
                                .images([builder.CardImage.create(session, restaurant.logoUrl)])
                                .buttons([
                                    builder.CardAction.openUrl(session, restaurant.url, 'More Info'),
                                    builder.CardAction.imBack(session, restaurant.name, 'Select')
                                ])
                            return card.toAttachment();
                        });
        
                        var choices = _.map(restaurants, (x) => { return x.name; });
        
                        var msg = new builder.Message(session)
                            .text(prompt)
                            .attachments(cardAttachments)
                            .attachmentLayout(builder.AttachmentLayout.carousel);
        
                        builder.Prompts.choice(session, msg, choices);
                    } else {
                        session.send(constants.messages.RESTAURANT_UNRECOGNIZED);
                    }
                });
        }
    },
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        var restaurantName = results.response && results.response.entity;

        restaurantService.getRestaurant(reservation.location, restaurantName).then((restaurant) => {
            if (restaurant) {
                reservation.restaurant = restaurant;

                session.send(constants.messages.RESTAURANT_CONFIRMATION, restaurant.name);

                session.endDialogWithResult({ response: reservation });
            }   else {
                session.send(constants.messages.RESTAURANT_UNRECOGNIZED)
            }
        });
    }
]);