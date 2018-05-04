var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');

module.exports = new builder.WaterfallDialog([
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        if (!reservation.location) {
            builder.Prompts.text(session, constants.messages.LOCATION_REQUEST);
        } else {
            session.beginDialog('CuisineDialog');
        }
    },
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        var location = results.response;
        if (location) {            
            restaurantService.hasRestaurants(location).then(function(hasResaurants) {
                if (hasResaurants) {
                    // Update private conversation data
                    reservation.location = location;
    
                    // Send confirmation message
                    session.send(util.format(constants.messages.LOCATION_CONFIRMATION, location));
    
                    session.beginDialog('CuisineDialog');
                    return;
                } else {
                    session.send(constants.messages.LOCATION_UNRECOGNIZED);
                } 
            });            
        } 
        next();
    }
]);