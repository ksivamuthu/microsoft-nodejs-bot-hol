var builder = require('botbuilder');
var chrono = require('chrono-node');
var constants = require('../constants');
var moment = require('moment');
var util = require('util');

module.exports = new builder.WaterfallDialog([
    (session, args, next) => {
        var intent = args.intent;
        var locationKey = 'RestaurantReservation.Address';
        var cuisineKey = 'RestaurantReservation.Cuisine';
        var datetimeKey = 'builtin.datetimeV2.datetime';
        var timeKey = 'builtin.datetimeV2.time';
        var partySizeKey = 'builtin.number';

        var location = builder.EntityRecognizer.findEntity(intent.entities, locationKey);
        var cuisine = builder.EntityRecognizer.findEntity(intent.entities, cuisineKey);

        var whenDateTimeEntity = builder.EntityRecognizer.findEntity(intent.entities, datetimeKey);
        var whenTimeEntity = builder.EntityRecognizer.findEntity(intent.entities, timeKey);

        var when = whenDateTimeEntity || whenTimeEntity;
        var whenTime = null;
        if (when) {
            var parseResults = chrono.parse(when.entity);
            if (parseResults && parseResults.length > 0) {
                whenTime = parseResults[0].ref;
            }
        }

        var partySize = builder.EntityRecognizer.findEntity(intent.entities, partySizeKey);

        session.privateConversationData.reservation = {
            location: location ? location.entity : null,
            cuisine: cuisine ? cuisine.entity : null,
            when: whenTime || null,
            partySize: partySize ? partySize.entity : null
        };

        session.send(constants.messages.GREETING);

        session.beginDialog('LocationDialog');

    },

    (session, results, next) => {
        session.beginDialog('CuisineDialog');
    },

    (session, results, next) => {
        session.beginDialog('RestaurantDialog');
    },

    (session, results, next) => {
        session.beginDialog('WhenDialog');
    },

    (session, results, next) => {
        session.beginDialog('PartySizeDialog');
    },

    (session, results, next) => {
        session.beginDialog('ConfirmReservationDialog');
    },

    (session, results, next) => {
        var reservation = session.privateConversationData.reservation;
        var when = moment(reservation.when);
        var text = util.format(constants.messages.BOOKED_CONFIRMATION, reservation.restaurant.name, when.format('ll'), when.format('LT'));
        session.endConversation(text);        
    }
]);