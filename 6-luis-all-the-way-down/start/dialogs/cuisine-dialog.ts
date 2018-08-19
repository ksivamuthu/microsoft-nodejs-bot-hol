import { CardAction, Message, Prompts, SuggestedActions, WaterfallDialog } from "botbuilder";
import * as _ from "lodash";
import { Reservation } from "../model/reservation";
import { RestaurantService } from "../service/restaurant-service";

const restaurantService = new RestaurantService();
const dialog = new WaterfallDialog([
    async (session, _args, next) => {
        const reservation: Reservation = session.privateConversationData.reservation;
        if (reservation.cuisine) {  
            session.endDialogWithResult({ response: reservation.cuisine });
            return; 
        }

        // Ask cuisines
        const cuisines = await restaurantService.getCuisines(reservation.location!);
        const cardActions = _.map(cuisines, (x) => {
            return CardAction.imBack(session, x.name, `${x.name} (${x.count})`);
        });

        const choices = _.map(cuisines, (x) => x.name);
        const suggestedActions = SuggestedActions.create(session, cardActions);

        const msg = new Message(session)
            .text('CUISINE_REQUEST')
            .suggestedActions(suggestedActions);

        Prompts.choice(session, msg, choices);
    },
    async (session, results, _next) => {
        // Get cuisine
        const cuisine = results.response;
        if (cuisine) {
            const reservation: Reservation = session.privateConversationData.reservation;
            reservation.cuisine = cuisine.entity;

            session.send('CUISINE_CONFIRMATION');
        }
        session.endDialogWithResult({ response: cuisine });
    }
]);

export { dialog as CuisineDialog }