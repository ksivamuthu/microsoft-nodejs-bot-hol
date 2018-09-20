import { WaterfallDialog, IEntity, EntityRecognizer } from "botbuilder";
import { Reservation } from "../model/reservation";
import { CONSTANTS } from "../constants";

const dialog = new WaterfallDialog([
    (session, args, next) => {
        const reservation: Reservation = session.privateConversationData.reservation || new Reservation();
        session.privateConversationData.reservation = reservation;

        const entities: IEntity[] = args.intent.entities;

        const location = EntityRecognizer.findEntity(entities, CONSTANTS.entity.locationKey); 
        if(location) {
            reservation.location= location.entity;
        }

        const cuisine = EntityRecognizer.findEntity(entities, CONSTANTS.entity.cuisineKey);
        if(cuisine) {
            reservation.cuisine = cuisine.entity;
        }

        const when = EntityRecognizer.findEntity(entities, CONSTANTS.entity.datetimeKey);
        if(when) {
            reservation.when = when.entity;
        }

        const partySize = EntityRecognizer.findEntity(entities, CONSTANTS.entity.partySizeKey);
        if(partySize) {
            reservation.partySize = partySize.entity;
        }
        
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

        session.endDialog();
    }
]);

export { dialog as CreateReservationDialog }