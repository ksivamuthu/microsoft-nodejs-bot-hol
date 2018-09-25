import { ActivityTypes, ConversationState, StatePropertyAccessor, TurnContext } from "botbuilder";
import { LuisRecognizer } from "botbuilder-ai";
import * as moment from "moment";
import { CONSTANTS } from "./constants";
import { EntityRecognizer } from "./entity-recognizer";
import { Reservation } from "./model/reservation";

export class CreateReservationBot {
    private readonly reservationAccessor: StatePropertyAccessor<Reservation>
    constructor(private readonly luisRecognizer: LuisRecognizer,
                private readonly conversationState: ConversationState) { 
        // Constructor        
        this.reservationAccessor = conversationState.createProperty<Reservation>('Reservation');
    }

    public async onTurn(context: TurnContext) {
        if(context.activity.type === ActivityTypes.Message) {
            const results = await this.luisRecognizer.recognize(context);
            const entities = results.luisResult.entities;
            const intent = results.luisResult.topScoringIntent.intent;
            switch(intent) {
                case CONSTANTS.intents.NONE:
                    await context.sendActivity('Sorry, I don\'t understand.  I only know how to make restaurant reservations.');
                    break;
                case CONSTANTS.intents.CREATE_RESERVATION:  
                    await this.createReservation(context, entities);              
                    break;
            }
        }
    }

    private async createReservation(context: TurnContext, entities: any) {
        const reservation: Reservation = await this.reservationAccessor.get(context) || new Reservation();

        const location = this.findLocation(entities);
        if(location) {
            reservation.location = location;
        }

        const cuisine = this.findCuisine(entities);
        if(cuisine) {
            reservation.cuisine = cuisine;
        }

        const when = this.findWhen(entities);
        if(when) {
            reservation.when = when;
        }

        const partySize = this.findPartySize(entities);
        if(partySize) {
            reservation.partySize = partySize;
        }
        
        this.reservationAccessor.set(context, reservation);        
        this.conversationState.saveChanges(context);

        context.sendActivity('Looks like your attempting to create a reservation.  Let\'s see what information we were able to pull');
        
        
        const cReservation = await this.reservationAccessor.get(context);

        if(cReservation) {

            if (cReservation.location) {
                context.sendActivity(`Location Preference: ${reservation.location}`);
            }

            if (cReservation.cuisine) {
                context.sendActivity(`Cuisine Preference: ${reservation.cuisine}`);
            }

            if (cReservation.when) {
                context.sendActivity(`Date Preference: ${moment(reservation.when).format('LLLL')}`);
            }

            if (cReservation.partySize) {
                context.sendActivity(`Party Size Preference: ${reservation.partySize}`);
            }
        } 
        
        this.conversationState.clear(context);
    }

    private findLocation(entities: any): string {
        const locationEntity = EntityRecognizer.findEntity(entities, CONSTANTS.entity.locationKey);
        return locationEntity ? locationEntity.entity : null;
    }

    private findCuisine(entities: any): string {
        const cuisineEntity = EntityRecognizer.findEntity(entities, CONSTANTS.entity.cuisineKey);
        return cuisineEntity ? cuisineEntity.entity : null;
    }

    private findWhen(entities: any): Date | null {
        const whenDate = EntityRecognizer.findEntity(entities, CONSTANTS.entity.datetimeKey);
        const whenTime = EntityRecognizer.findEntity(entities, CONSTANTS.entity.timeKey);
        const when = whenDate || whenTime;
        return EntityRecognizer.recognizeDateTime(when.entity);
    }

    private findPartySize(entities: any): number | undefined {
        const partySizeEntity = EntityRecognizer.findEntity(entities, CONSTANTS.entity.partySizeKey);
        const size = partySizeEntity ? partySizeEntity.entity : null;
        if(size) {
            return EntityRecognizer.recognizeNumber(size);
        }
        return;
    }
}