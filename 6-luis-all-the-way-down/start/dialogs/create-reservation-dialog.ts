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
    // tslint:disable-next-line:radix
    return size ? parseInt(size) : undefined;
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
    (session, args, _next) => {
        const reservation: Reservation = session.privateConversationData.reservation || new Reservation();
        session.privateConversationData.reservation = reservation;

        // let intent: IIntent = args.intent.intent;
        const entities: IEntity[] = args.intent.entities;

        reservation.location = findLocation(entities);
        reservation.cuisine = findCuisine(entities);
        reservation.when = findWhen(entities);
        reservation.partySize = findPartySize(entities);

        session.send('GREETINGS');
        session.beginDialog('LocationDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('CuisineDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('RestaurantDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('WhenDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('PartySizeDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('ConfirmReservationDialog');
    },
    (session, _results, _next) => {
        const reservation: Reservation = session.privateConversationData.reservation;
        // Ask confirmation
        session.send('BOOKED_CONFIRMATION', reservation.restaurant!.name, moment(reservation.when).format('ll'), moment(reservation.when).format('LT'));
        session.endConversation();
    }
]);

export { dialog as CreateReservationDialog }