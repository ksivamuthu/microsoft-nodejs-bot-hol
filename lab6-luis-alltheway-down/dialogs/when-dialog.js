var restaurantService = require('../restaurants/restaurants.service');
var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');
var _ = require('lodash');
var moment = require('moment');
     
module.exports = new builder.WaterfallDialog([
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        if (!reservation.when) {
            var prompt = util.format(constants.messages.WHEN_REQUEST);
            builder.Prompts.time(session, prompt);
        } else {
           session.beginDialog('PartySizeDialog');
        }
    },
    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        var when = builder.EntityRecognizer.resolveTime([results.response]);
        if (when) {                    
            reservation.when = when;            
            session.send(constants.messages.WHEN_CONFIRMATION, reservation.restaurant.name, moment(when).format('LLLL'));
            
            session.beginDialog('PartySizeDialog');

            return;
        } else {
            session.send(constants.messages.WHEN_UNRECOGNIZED);        
        }

        next();
    }
]);