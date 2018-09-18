import { Prompts, WaterfallDialog, PromptType, PromptText } from "botbuilder";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    (session, _args, next) => {
        const reservation: Reservation = session.privateConversationData.reservation;
        if (reservation.location) { 
            session.endDialogWithResult({response: reservation.location});
            return;
        }
        Prompts.text(session, 'LOCATION_REQUEST');
    },
    (session, results, _next) => {
        // Get location
        const location = results.response;
        if (location) {
            const reservation: Reservation = session.privateConversationData.reservation;
            reservation.location = location;
            session.send('LOCATION_CONFIRMATION', location);
        }
        session.endDialogWithResult({ response: location });
    }
]);

export { dialog as LocationDialog }