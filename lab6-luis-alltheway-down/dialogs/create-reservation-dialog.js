var builder = require('botbuilder');
var chrono = require('chrono-node');
var constants = require('../constants');
var moment = require('moment');
var util = require('util');
var wordsToNum = require('words-to-numbers').wordsToNumbers;

module.exports = new builder.WaterfallDialog([
    (session, args, next) => {
        var intent = args.intent.intent;
        var entities = args.intent.entities;

        session.privateConversationData.reservation = session.privateConversationData.reservation || {};

        var reservation = session.privateConversationData.reservation;

        switch (intent) {
            case constants.intents.CREATE_RESERVATION:
                createReservation(entities);
                break;
            case constants.intents.SET_RESERVATION_LOCATION:
                setReservationLocation(entities);
                break;
            case constants.intents.SET_RESERVATION_DATE:
                setReservationWhen(entities);
                break;
            case constants.intents.SET_RESERVATION_CUISINE:
                setReservationCuisine(entities);
                break;
            case constants.intents.SET_RESERVATION_PARTY_SIZE:
                setReservationPartySize(entities);
                break;
        }

        session.beginDialog('LocationDialog');

        function createReservation(entities) {
            var location = findLocation(entities);
            var cuisine = findCuisine(entities);
            var partySize = findPartySize(entities);
            var when = findWhen(entities);

            reservation.location = location;
            reservation.cuisine = cuisine;
            reservation.when = when;
            reservation.partySize = partySize;

            session.send(constants.messages.CONFIRMATION);
        }

        function setReservationLocation(entities) {
            var location = findLocation(entities);
            if (location) {
                reservation.location = location;
                session.send(util.format(constants.messages.LOCATION_CONFIRMATION, location));
            }
        }

        function setReservationCuisine(entities) {
            var cuisine = findCuisine(entities);
            if (cuisine) {
                reservation.cuisine = cuisine;
                session.send(util.format(constants.messages.CUISINE_CONFIRMATION, cuisine));
            }
        }

        function setReservationWhen(entities) {
            var when = findWhen(entities);
            if (when) {
                reservation.when = when;
                session.send(util.format(constants.messages.WHEN_CONFIRMATION, when));
            }
        }

        function setReservationPartySize(entities) {
            var partySize = findPartySize(entities);
            if (partySize) {
                reservation.partySize = partySize;
                session.send(util.format(constants.messages.PARTY_SIZE_CONFIRMATION, partySize));
            }
        }

        function findLocation(entities) {
            var location = builder.EntityRecognizer.findEntity(entities, constants.entity.locationKey);
            return location ? location.entity : null;
        }

        function findCuisine(entities) {
            var cuisine = builder.EntityRecognizer.findEntity(entities, constants.entity.cuisineKey);
            return cuisine ? cuisine.entity : null;
        }

        function findPartySize(entities) {
            var partySize = builder.EntityRecognizer.findEntity(entities, constants.entity.partySizeKey);
            var size =  partySize ? partySize.entity : null;
            return size ? parseInt(size) || wordsToNum(size) : null;
        }

        function findWhen(entities) {
            var whenDateTimeEntity = builder.EntityRecognizer.findEntity(entities, constants.entity.datetimeKey);
            var whenTimeEntity = builder.EntityRecognizer.findEntity(entities, constants.entity.timeKey);
            var when = whenDateTimeEntity || whenTimeEntity;
            var whenTime = null;
            if (when) {
                var parseResults = chrono.parse(when.entity);
                if (parseResults && parseResults.length > 0) {
                    whenTime = parseResults[0].ref;
                }
            }

            return whenTime;
        }
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