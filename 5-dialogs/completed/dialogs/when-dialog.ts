import { EntityRecognizer, Prompts, WaterfallDialog } from "botbuilder";
import * as moment from "moment";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    async (session, _args, next) => {
        const reservation: Reservation = session.privateConversationData.reservation;
        if (reservation.when) { 
            session.endDialogWithResult({ response: reservation.when });
            return; 
        }
        // Ask time
        Prompts.time(session, 'WHEN_REQUEST');
    },
    async (session, results, _next) => {
        // Get time
        let whenTime : Date | null = null;
        if (results.response) {
            whenTime = EntityRecognizer.resolveTime([results.response]);

            const reservation: Reservation = session.privateConversationData.reservation;
            reservation.when = whenTime;

            session.send('WHEN_CONFIRMATION', reservation.restaurant!.name, moment(whenTime).format('LLLL'));
            session.endDialogWithResult({ response: whenTime });
        } else {
            session.send('WHEN_UNRECOGNIZED');
            session.replaceDialog('WhenDialog');
        }                
    }
]);

export { dialog as WhenDialog }