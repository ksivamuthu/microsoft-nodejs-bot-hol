# Lab 4 - Bot Builder

Dialogs in the Bot Builder SDK for Node.js allow you to model conversations and manage conversation flow. A bot communicates with a user via conversations. Conversations are organized into dialogs. Dialogs can contain waterfall steps, and prompts. As the user interacts with the bot, the bot will start, stop, and switch between various dialogs in response to user messages. Understanding how dialogs work is key to successfully designing and creating great bots.

## Conversations through dialogs

Bot Builder SDK for Node.js defines a conversation as the communication between a bot and a user through one or more dialogs. A dialog, at its most basic level, is a reusable module that performs an operation or collects information from a user. You can encapsulate the complex logic of your bot in reusable dialog code.

A conversation can be structured and changed in many ways:

- It can originate from your [default dialog](#default-dialog).
- It can be redirected from one dialog to another.
- It can be resumed.
- It can follow a waterfall pattern, which guides the user through a series of steps or prompts the user with a series of questions.
- It can use actions that listen for words or phrases that trigger a different dialog. 

You can think of a conversation like a parent to dialogs. As such, a conversation contains a *dialog stack* and maintain its own set of state data; namely, the `conversationData` and the `privateConversationData`. A dialog, on the other hand, maintains the `dialogData`. 


## Dialog stack

A bot interacts with a user through a series of dialogs that are maintained on a dialog stack. Dialogs are pushed on and popped off the stack in the course of a conversation. The stack works like a normal LIFO stack; meaning, the last dialog added will be the first one to complete. Once a dialog completes then control is returned to the previous dialog on the stack.

When a bot conversation first starts or when a conversation ends, the dialog stack is empty. At this point, when the a user sends a message to the bot, the bot will respond with the *default dialog*.

## Default Dialog

The following code snippet shows how to define the default dialog when creating the `UniversalBot` object.

```javascript
var bot = new builder.UniversalBot(connector, [
    //...Default dialog waterfall steps...
    ]);
```
## Dialog handlers

The dialog handler manages the flow of a conversation. To progress through a conversation, the dialog handler directs the flow by starting and ending dialogs. 

## Starting and ending dialogs

To start a new dialog (and push it onto the stack), use [`session.beginDialog()`](http://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session#begindialog). To end a dialog (and remove it from the stack, returning control to the calling dialog), use either [`session.endDialog()`](http://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session#enddialog) or [`session.endDialogWithResult()`](http://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session#enddialogwithresult).

## Using waterfalls and prompts

When a bot reaches the end of the waterfall without ending the dialog, the next message from the user will restart that dialog at step one of the waterfall. To avoid this situation, when a conversation or dialog has come to an end, it is best practice to explicitly call `endDialog`, `endDialogWithResult`, or `endConversation`

## Prompts and responses

Whenever you need input from a user, you can send a prompt, wait for the user to respond with input, and then process the input and send a response to the user.

The following code sample prompts the user for their name and responds with a greeting message.

```javascript
bot.dialog('greetings', [
    // Step 1
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    // Step 2
    function (session, results) {
        session.endDialog(`Hello ${results.response}!`);
    }
]);
```

Using this basic construct, you can model your conversation flow by adding as many prompts and responses as your bot requires.

## Prompt results 

Built-in prompts are implemented as dialogs that return the user's response in the `results.response` field. For JSON objects, responses are returned in the `results.response.entity` field. Any type of dialog handler can receive the result of a prompt. Once the bot receives a response, it can consume it or pass it back to the calling dialog by calling the [`session.endDialogWithResult`][EndDialogWithResult] method.

## Prompt types
The Bot Builder SDK for Node.js includes several different types of built-in prompts. 

|**Prompt type**     | **Description** |     
| ------------------ | --------------- |
|[Prompts.text](#promptstext) | Asks the user to enter a string of text. |     
|[Prompts.confirm](#promptsconfirm) | Asks the user to confirm an action.| 
|[Prompts.number](#promptsnumber) | Asks the user to enter a number.     |
|[Prompts.time](#promptstime) | Asks the user for a time or date/time.      |
|[Prompts.choice](#promptschoice) | Asks the user to choose from a list of options.    |
|[Prompts.attachment](#promptsattachment) | Asks the user to upload a picture or video.|       

## Rich Cards

## Types of rich cards 
The Bot Framework currently supports eight types of rich cards: 

| Card type | Description |
|------|------|
| Adaptive Card | A customizable card that can contain any combination of text, speech, images, buttons, and input fields.  |
| Animation Card | A card that can play animated GIFs or short videos. |
| Audio Card | A card that can play an audio file. |
| Hero Card | A card that typically contains a single large image, one or more buttons, and text. |
| Thumbnail Card | A card that typically contains a single thumbnail image, one or more buttons, and text.|
| Receipt Card | A card that enables a bot to provide a receipt to the user. It typically contains the list of items to include on the receipt, tax and total information, and other text. |
| Signin Card | A card that enables a bot to request that a user sign-in. It typically contains text and one or more buttons that the user can click to initiate the sign-in process. |
| Video Card | A card that can play videos. |

## Global Message Handlers (Scorables)

There are times when you need to provide the user with global commands regardless of the current Dialog (for example, if the user types 'cancel' or 'nevermind', we might want to end the conversation regardless of the current Dialog). That being said, we shouldn't have to handle this in every Dialog, and luckily we don't.

Scorables are a means of monitoring all incoming messages prior to being sent to the active Dialog, providing the ability to intercept the message and taking action.

We'll learn more about [Scorables](../7-scorables) in a later lab.

## Quick Recap

Throughout this lab, we learned some basic Bot Framework concepts, including Dialogs, DialogStacks, Prompts and Richcards.

## Next Steps

Hopefully you will find this information useful throughout the remainder of the labs and your future bot development. Armed with this new-found knowledge, we're going to continue to build-out our reservation bot in [Lab 5](../5-dialogs), using many of these concepts.
