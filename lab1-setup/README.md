# Lab 1 - Bot Framework Setup

In this lab, we'll setup our Visual Studio NodeJS Bot Framework development environment.  This includes the following:

1.	Creating and running our first *Hello World* bot project
2.  Running and debugging through vscode and bot emulator
3.	A quick review of the Bot Builder SDK for NodeJS

## Prerequisites
Get started by completing the following prerequisite tasks:

1. Install [Node.js](https://nodejs.org).
2. Create a folder for your bot.
3. From a command prompt or terminal, navigate to the folder you just created.
4. Run the following **npm** command:

    ```nodejs
    npm init
    ```

Follow the prompt on the screen to enter information about your bot and npm will create a **package.json** file that contains the information you provided. 

## Installing the Bot emulator

You can [download](https://emulator.botframework.com) and install the emulator. After the download completes, launch the executable and complete the installation process.

## Creating a first project.

* Install `botbuilder`, `botbuilder-azure` and `restify` dependencies.
 ```sh
 npm i botbuilder --save
 npm i botbuilder-azure --save
 npm i restify --save-dev
 ```
* Copy the below snippet to setup hello world project

```javascript
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.

var bot = new builder.UniversalBot(connector, function (session, args) {
    session.beginDialog('GreetingsDialog');
});

// Set inMemory Storage
var inMemoryStorage = new builder.MemoryBotStorage();
bot.set('storage', inMemoryStorage);

bot.localePath(path.join(__dirname, './locale'));

// Greetings Dialog
bot.dialog('GreetingsDialog', [
    function (session, results) {
        var text = session.message.text;
        // Count the text length and send it back
        session.endDialog(`You sent \"${text}\" which was ${text.length} characters`);
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = connector.listen();
}


```

## Start and test your bot

After installing the emulator, navigate to your bot's directory in a console window and start your bot:

```nodejs
node app.js
```
   
Your bot is now running locally.

### Start the emulator and connect your bot
After you start your bot, connect to your bot in the emulator:

1. Type `http://localhost:3978/api/messages` into the address bar. (This is the default endpoint that your bot listens to when hosted locally.)
2. Click **Connect**. You won't need to specify **Microsoft App ID** and **Microsoft App Password**. You can leave these fields blank for now. You'll get this information later when you [register your bot](../bot-service-quickstart-registration.md).

### Try out your bot

Now that your bot is running locally and is connected to the emulator, try out your bot by typing a few messages in the emulator.
You should see that the bot responds to each message you send by echoing back 

`You sent <message> which was <message length> characters`

For eg: If you send `hello`, you might see `You sent hello which was 5 characters`

You've successfully created your first bot using the Bot Builder SDK for Node.js!

## Quick Recap

Congratulations, you now have a complete VSCode development environment capable of debugging custom bot applications! 

Throughout the remainder of the labs, we'll be building out a bot that helps users make restaurant reservations.  Users will be able to ask our bot things like:

*	Make me a reservation at a good Indian restaurant in Pittsburgh
*	Can you book me a table tomorrow night at 7:30 for Mexican?

But wait a minute, we're simply sending text-based messages to our bot.  How can we possibly parse and interpret all the variations of how users might ask for a reservation?  Thats where Natural Language processing and Machine Learning comes in.

## Next Steps
In [Lab 2](https://github.com/gtewksbury/Microsoft-Bot-Framework-HOL/tree/master/lab%202%20-%20LUIS) we'll build a machine learning model using Microsoft's Language Understanding Intelligence Service (known as LUIS) to give our bot some smarts.