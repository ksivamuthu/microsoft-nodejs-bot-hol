// Load .env files as process variables
import * as dotenv from 'dotenv';
dotenv.config();

import { ActivityTypes, BotFrameworkAdapter, ConversationState, MemoryStorage } from 'botbuilder';
import { LuisApplication, LuisRecognizer } from 'botbuilder-ai';
import * as restify from 'restify';
import { CreateReservationBot } from './create-reservation-bot';

// Construct adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Create restify server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => console.log(`${server.name} listening to ${server.url}`));

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);

const luisApplication : LuisApplication = {
    applicationId: process.env.LuisAppId as string,
    endpoint: process.env.LuisAPIHostName as string,
    endpointKey: process.env.LuisAPIKey as string
};

const luisRecognizer = new LuisRecognizer(luisApplication, { includeAllIntents: false, log: true, staging: false}, true);

const createReservationBot = new CreateReservationBot(luisRecognizer, conversationState);

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
         if(context.activity.type === ActivityTypes.Message) {
             await createReservationBot.onTurn(context);             
         }
    });
});