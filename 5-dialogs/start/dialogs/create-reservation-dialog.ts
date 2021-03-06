import * as Recognizers from "@microsoft/recognizers-text-suite";
import { EntityRecognizer, IEntity, WaterfallDialog } from "botbuilder";
import * as moment from "moment";
import { CONSTANTS } from "../constants";
import { Reservation } from "../model/reservation";

const findLocation = (entities: IEntity[]): string => {
    const locationEntity = EntityRecognizer.findEntity(entities, CONSTANTS.entity.locationKey);
    return locationEntity ? locationEntity.entity : null;
};

const findCuisine = (entities: IEntity[]): string => {
    const cuisineEntity = EntityRecognizer.findEntity(entities, CONSTANTS.entity.cuisineKey);
    return cuisineEntity ? cuisineEntity.entity : null;
};

const findPartySize = (entities: IEntity[]): number | undefined => {
    const partySizeEntity = EntityRecognizer.findEntity(entities, CONSTANTS.entity.partySizeKey);
    const size = partySizeEntity ? partySizeEntity.entity : null;
    if(size) {
        const results = Recognizers.recognizeNumber(size, Recognizers.Culture.English);
        if(results && results[0]) {
            return parseInt(results[0].resolution.value, 10);
        }
    }
    return;
};

const findWhen = (entities: IEntity[]): Date | undefined => {
    const whenDateTimeEntity = EntityRecognizer.findEntity(entities, CONSTANTS.entity.datetimeKey);
    const whenTimeEntity = EntityRecognizer.findEntity(entities, CONSTANTS.entity.timeKey);
    const when = whenDateTimeEntity || whenTimeEntity;
    if (when) {
        return EntityRecognizer.parseTime(when.entity);
    }
    return;
}

const dialog = new WaterfallDialog([
    (session, args, next) => {
        const reservation: Reservation = session.privateConversationData.reservation || new Reservation();
        session.privateConversationData.reservation = reservation;

        const entities: IEntity[] = args.intent.entities;

        const location = findLocation(entities);
        if(location) {
            reservation.location= location;
        }

        const cuisine = findCuisine(entities);
        if(cuisine) {
            reservation.cuisine = cuisine;
        }

        const when = findWhen(entities);
        if(when) {
            reservation.when = when;
        }

        const partySize = findPartySize(entities);
        if(partySize) {
            reservation.partySize = partySize;
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
                session.send(`Date Preference: ${moment(reservation.when).format('LLLL')}`);
            }

            if (reservation.partySize) {
                session.send(`Party Size Preference: ${reservation.partySize}`);
            }
        }

        session.endConversation();
    }
]);

export { dialog as CreateReservationDialog }