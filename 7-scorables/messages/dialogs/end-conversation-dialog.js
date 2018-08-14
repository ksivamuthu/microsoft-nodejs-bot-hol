var builder = require("botbuilder");
var constants = require('../constants');
var util = require('util');

module.exports = new builder.SimpleDialog((session, args) => {
    session.endConversation(constants.messages.CANCEL_CONFIRMATION);
});