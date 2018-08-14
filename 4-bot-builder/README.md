# Lab 4 - Bot Builder (TBD)

Dialogs in the Bot Builder SDK for Node.js allow you to model conversations and manage conversation flow. A bot communicates with a user via conversations. Conversations are organized into dialogs. Dialogs can contain waterfall steps, and prompts. As the user interacts with the bot, the bot will start, stop, and switch between various dialogs in response to user messages. Understanding how dialogs work is key to successfully designing and creating great bots.

## Conversations through dialogs
...

## Dialog stack
...

## Default Dialog

The following code snippet shows how to define the default dialog when creating the `UniversalBot` object.

```javascript
var bot = new builder.UniversalBot(connector, [
    //...Default dialog waterfall steps...
    ]);
```
## Dialog handlers
...

## Starting and ending dialogs

To start a new dialog (and push it onto the stack), use [`session.beginDialog()`](http://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session#begindialog). To end a dialog (and remove it from the stack, returning control to the calling dialog), use either [`session.endDialog()`](http://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session#enddialog) or [`session.endDialogWithResult()`](http://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session#enddialogwithresult).

## Using waterfalls and prompts

When a bot reaches the end of the waterfall without ending the dialog, the next message from the user will restart that dialog at step one of the waterfall. To avoid this situation, when a conversation or dialog has come to an end, it is best practice to explicitly call `endDialog`, `endDialogWithResult`, or `endConversation`.
