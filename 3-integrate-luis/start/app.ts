import * as dotenv from 'dotenv';
dotenv.config();

import { ActivityTypes, BotFrameworkAdapter } from 'botbuilder';
import * as restify from 'restify';

// Construct adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Create restify server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => console.log(`${server.name} listening to ${server.url}`));

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
         if(context.activity.type === ActivityTypes.Message) {
             const text = context.activity.text;
             await context.sendActivity(`You sent '${text}' which was ${text.length} characters `);
         }
    });
});
