"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const reservation_1 = require("../model/reservation");
const constants_1 = require("../constants");
const dialog = new botbuilder_1.WaterfallDialog([
    (session, args, next) => {
        const reservation = new reservation_1.Reservation();
        session.privateConversationData.reservation = reservation;
        const entities = args.intent.entities;
        const location = botbuilder_1.EntityRecognizer.findEntity(entities, constants_1.CONSTANTS.entity.locationKey);
        const cuisine = botbuilder_1.EntityRecognizer.findEntity(entities, constants_1.CONSTANTS.entity.cuisineKey);
        const when = botbuilder_1.EntityRecognizer.findEntity(entities, constants_1.CONSTANTS.entity.timeKey);
        const partySize = botbuilder_1.EntityRecognizer.findEntity(entities, constants_1.CONSTANTS.entity.partySizeKey);
        reservation.location = location ? location.entity : null;
        reservation.cuisine = cuisine ? cuisine.entity : null;
        reservation.when = when ? when.entity : null;
        reservation.partySize = partySize ? partySize.entity : null;
        session.send('Looks like your attempting to create a reservation.  Let\'s see what information we were able to pull');
        if (next)
            next();
    }, (session, _args, _next) => {
        const reservation = session.privateConversationData.reservation;
        if (reservation != null) {
            if (reservation.location) {
                session.send(`Location Preference: ${reservation.location}`);
            }
            if (reservation.cuisine) {
                session.send(`Cuisine Preference: ${reservation.cuisine}`);
            }
            if (reservation.when) {
                session.send(`Date Preference: ${reservation.when}`);
            }
            if (reservation.partySize) {
                session.send(`Party Size Preference: ${reservation.partySize}`);
            }
        }
        session.endConversation();
    }
]);
exports.CreateReservationDialog = dialog;
//# sourceMappingURL=create-reservation-dialog.js.map