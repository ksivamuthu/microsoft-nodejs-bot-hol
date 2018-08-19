import { WaterfallDialog, IEntity, EntityRecognizer } from "botbuilder";
import { Reservation } from "../model/reservation";
import { CONSTANTS } from "../constants";

const dialog = new WaterfallDialog([
    (session, args, next) => {
        const reservation: Reservation = new Reservation();
        session.privateConversationData.reservation = reservation;

        const entities: IEntity[] = args.intent.entities;

        const location = EntityRecognizer.findEntity(entities, CONSTANTS.entity.locationKey);
        const cuisine = EntityRecognizer.findEntity(entities, CONSTANTS.entity.cuisineKey);
        const when = EntityRecognizer.findEntity(entities, CONSTANTS.entity.timeKey);
        const partySize = EntityRecognizer.findEntity(entities, CONSTANTS.entity.partySizeKey);

        reservation.location = location ? location.entity : null;
        reservation.cuisine = cuisine ? cuisine.entity : null;
        reservation.when = when ? when.entity : null;
        reservation.partySize = partySize ? partySize.entity : null;
        
        session.send('Looks like your attempting to create a reservation.  Let\'s see what information we were able to pull');

        if(next) next();
    }, (session, _args, _next) => {
        const reservation: Reservation = session.privateConversationData.reservation;
        if(reservation != null) {
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

export { dialog as CreateReservationDialog }