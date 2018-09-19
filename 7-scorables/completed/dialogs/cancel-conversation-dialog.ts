import { WaterfallDialog } from "botbuilder";

const dialog = new WaterfallDialog([
    async (session, _args, _next) => {
        session.endConversation('CANCEL_CONFIRMATION');
    }
]);

export { dialog as CancelConversationDialog }