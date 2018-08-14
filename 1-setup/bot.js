"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_azure_1 = require("botbuilder-azure");
const connector = new botbuilder_azure_1.BotServiceConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new botbuilder_1.UniversalBot(connector);
bot.set('storage', new botbuilder_1.MemoryBotStorage());
exports.default = bot;
//# sourceMappingURL=bot.js.map