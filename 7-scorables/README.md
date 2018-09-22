
# Lab 7 - Custom Intent Recognizers / Scorables

Throughout the labs, we've learned that bot applications can be made of multiple Dialogs, and all user responses are passed to the top (or active) Dialog in the DialogStack. But what if you want to globally handle incoming messages from users, regardless of the current active Dialog? For example, if the user types `help`, we should provide help options regardless of the current Dialog. Another example would be allowing the user to `cancel` any point in a conversation.

In this short lab, we'll learn how we can use global message handlers throughout our bot application.

## Register a custom intent recognizer

* You can also implement a custom recognizer. This example adds a simple recognizer that looks for the user to say 'help' or 'goodbye' but you could easily add a recognizer that does more complex processing. You can pass `score` and `intent` to callback to trigger the dialog.

```typescript
bot.recognizer({
    recognize (context, done) {
        const error: Error | null = null;
        let intent = { score: 0.0, intent: '' };
        const values = ['cancel', 'nevermind', 'never mind', 'forget it', 'forgetit'];
        
        if (context.message.text) {
            if (_.includes(values, context.message.text.toLowerCase())) {
                intent = { score: 1.0, intent: 'EndConversation' };
            }
        }        
        done(error!, intent);
    }
});
```

* Once you've registered a recognizer, you can associate the recognizer with an action using a matches clause.

```typescript
bot.dialog('EndConversationDialog', EndConversationDialog)
    .triggerAction({ matches: ['EndConversation'] });
```

* Create `end-conversation-dialog.ts` in dialogs directory with following content.

```typescript
import { WaterfallDialog } from "botbuilder";

const dialog = new WaterfallDialog([
    async (session, _args, _next) => {
        session.endConversation('CANCEL_CONFIRMATION');
    }
]);

export { dialog as EndConversationDialog }
```

## Demo

Let's give it a try. Go ahead and run your project along with the emulator and type `I'd like to reserve a table in Pittsburgh`. When the bot prompts you for a preferred cuisine, type `nevermind`.

Your bot should have sent you a friendly Good-Bye message before it ended the conversation. This should work regardless of your current position in the conversation. 

This time, enter information up until the point when the bot asks you to confirm your reservation. At that point, type `cancel`. You should see the same result!

## Quick Recap

In this short lab, we learned how to create and register intent recognizer to handle messages globally throughout our bot application.

## Next Steps

In [Lab 8](../8-azure-bot-services), we'll learn how to deploy and host our bot within Microsoft Azure.