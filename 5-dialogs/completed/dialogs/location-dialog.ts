import { Prompts, WaterfallDialog } from "botbuilder";
import { Reservation } from "../model/reservation";
import { RestaurantService } from "../service/restaurant-service";

const dialog = new WaterfallDialog([
    (session, args, _next) => {
        const reservation: Reservation = session.privateConversationData.reservation;
        if (reservation.location) { 
            session.endDialogWithResult({response: reservation.location});
            return;
        }
        
        if(args && args.unrecognized) {
            Prompts.text(session, 'LOCATION_UNRECOGNIZED');
        } else {                    
            Prompts.text(session, 'LOCATION_REQUEST');
        }
    },
    async (session, results, _next) => {
        // Get location
        const location = results.response;
        const reservation: Reservation = session.privateConversationData.reservation;
            
        if (await RestaurantService.hasRestaurants(location)) {
            reservation.location = location;
            session.send('LOCATION_CONFIRMATION', location);
            session.endDialogWithResult({ response: location });
        } else {
            session.replaceDialog('LocationDialog', { unrecognized: true });
        }        
    }
]);

export { dialog as LocationDialog }