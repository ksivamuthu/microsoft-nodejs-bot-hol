import { AttachmentLayout, CardAction, CardImage, Message, Prompts, ThumbnailCard, WaterfallDialog } from "botbuilder";
import * as _ from "lodash";
import { Reservation } from "../model/reservation";
import { RestaurantService } from "../service/restaurant-service";

const restaurantService = new RestaurantService();
const dialog = new WaterfallDialog([
    async (session, _args, _next) => {
        const reservation: Reservation = session.privateConversationData.reservation;

        // Ask restaurants toselect
        const restaurants = await restaurantService.getRestaurants(reservation.location!, reservation.cuisine!);
        const cardAttachments = _.map(restaurants, (restaurant) => {
            const card = new ThumbnailCard(session)
                .title(restaurant.name)
                .subtitle(restaurant.address)
                .images([CardImage.create(session, restaurant.logoUrl.toString())])
                .buttons([
                    CardAction.openUrl(session, restaurant.url.toString(), 'More Info'),
                    CardAction.imBack(session, restaurant.name, 'Select')
                ])
            return card.toAttachment();
        });

        const choices = _.map(restaurants, (x) => x.name);

        const msg = new Message(session)
            .text('RESTAURANT_REQUEST', reservation.cuisine, reservation.location)
            .attachments(cardAttachments)
            .attachmentLayout(AttachmentLayout.carousel);

        Prompts.choice(session, msg, choices);
    },
    async (session, results, _next) => {
        // Get restaurant
        const restaurantName = results.response.entity;
        const reservation: Reservation = session.privateConversationData.reservation;

        const restaurant = await restaurantService.getRestaurant(reservation.location!, restaurantName);

        if (restaurant) {
            reservation.restaurant = restaurant;
            session.send('RESTAURANT_CONFIRMATION', restaurant.name);
        }
        session.endDialogWithResult({ response: restaurant });
    }
]);

export { dialog as RestaurantDialog }