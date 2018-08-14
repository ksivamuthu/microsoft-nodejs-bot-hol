import { MemoryBotStorage, UniversalBot } from 'botbuilder';
import { BotServiceConnector } from 'botbuilder-azure';

const connector =  new BotServiceConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new UniversalBot(connector);

bot.set('storage', new MemoryBotStorage());

export default bot;
