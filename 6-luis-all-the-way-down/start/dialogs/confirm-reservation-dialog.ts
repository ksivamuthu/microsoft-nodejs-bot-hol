import { CardAction, CardImage, HeroCard, Message, Prompts, WaterfallDialog } from "botbuilder";
import * as moment from "moment";
import { Reservation } from "../model/reservation";
import { Restaurant } from "../model/restaurant";

const dialog = new WaterfallDialog([
    async (session, _args, _next) => {
        // Ask confirmation
        const reservation: Reservation = session.privateConversationData.reservation;
        const when = moment(reservation.when);
        const restaurant = Restaurant.fromJson(reservation.restaurant);

        const card = new HeroCard(session)
            .title(`${restaurant.name} (${reservation.partySize})`)
            .subtitle(when.format('LLLL'))
            .text(`${restaurant.address}`)
            .images([CardImage.create(session, restaurant.logoUrl.toString())])
            .buttons([CardAction.imBack(session, 'Reserve', 'Reserve')]);

        const msg = new Message(session)
            .text('RESERVATION_CONFIRMATION')
            .attachments([card.toAttachment()]);

        Prompts.choice(session, msg, 'Reserve');
    },
    async (session, results, _next) => {
        if (results.response.entity === 'Reserve') {
            // Ask confirmation
            session.endDialogWithResult({ response: 'confirmed' });
        }
    }
]);

export { dialog as ConfirmReservationDialog }