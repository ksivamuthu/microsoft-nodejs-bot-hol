# Lab 3 - Integrate LUIS

In this lab, we are going to integrate the sample bot created in [Lab 1 - Setup](../1-setup) with the LUIS model trained in [Lab2 - LUIS](../2-luis).

## Prerequisites

Get the LUIS Model ID and subscription key from [LUIS website](https://luis.ai).

```
https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<MODEL_ID>?subscription-key=<SUBSCRIPTION_KEY> &verbose=true&timezoneOffset=0&q=
```

## How to integrate LUIS?

``` javascript
// Add LUIS
const luisAppId = process.env.LuisAppId;
const luisAPIKey = process.env.LuisAPIKey;
const luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
const recognizer = new LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);
```

## Add Intent to handle LUIS recognition result

Create a dialog with triggerAction that matches the LUIS intent

```js

bot.dialog('CreateReservationDialog', CreateReservationDialog)
   .triggerAction({ matches: CONSTANTS.intents.CREATE_RESERVATION });

```

## Retrieve entity from the intent result

```js
import { WaterfallDialog, IEntity, EntityRecognizer } from "botbuilder";
import { Reservation } from "../model/reservation";
import { CONSTANTS } from "../constants";

const dialog = new WaterfallDialog([
    (session, args, next) => {
        const reservation: Reservation = new Reservation();
        session.privateConversationData.reservation = reservation;

        const entities: IEntity[] = args.intent.entities;

        const location = EntityRecognizer.findEntity(entities, CONSTANTS.entity.locationKey);
        const cuisine = EntityRecognizer.findEntity(entities, CONSTANTS.entity.cuisineKey);
        const when = EntityRecognizer.findEntity(entities, CONSTANTS.entity.timeKey);
        const partySize = EntityRecognizer.findEntity(entities, CONSTANTS.entity.partySizeKey);

        reservation.location = location ? location.entity : null;
        reservation.cuisine = cuisine ? cuisine.entity : null;
        reservation.when = when ? when.entity : null;
        reservation.partySize = partySize ? partySize.entity : null;
        
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

        session.endConversation();
    }
]);

export { dialog as CreateReservationDialog }
```

## Demo
![](../images/luis-demo/luis-demo.gif)

## Quick Recap

In this lab, we successfully connected our bot to our LUIS application, and configured our Create Reservation triggerAction. We also learned how to retrieve value from entities. Finally, we learned how to persist and retrieve state for our bot application.

## Next Steps

At this point in the labs we were able to configure our RootDialog to handle multiple user intents, but we're yet to do anything useful with the provided information. In subsequent labs, we'll create a more sophisticated conversational flow with multiple dialogs. However, before doing so I thought it would be a good idea to become familiar with some basic NodeJS Bot Builder concepts. In [Lab 4](../4-bot-builder) we'll focus on learning these concepts before moving back to enhance our bot!
