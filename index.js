const {google} = require('googleapis');
const authorizationService = require('./authorization');
const messagesService = require('./messages');
const parser = require('./linxoParserV1');
const store = require('./store');

// Start
authorizationService.loadCredentials(listMessages);

/**
 * Retrieve Messages in user's mailbox matching query.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listMessages(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const query = 'from:(assistance@linxo.com) subject:notification';
  const sheets = google.sheets({version: 'v4', auth});

  messagesService.getMessages(gmail, query
    , (messages) => {
      let parsedMessages = [];
      messages.forEach((message, index) => {
        console.log(`------------------------------------------------------`);
        console.log(`Message [${index}]`);
        parsedMessages.push(parser.parse(message));
      });

      store.addTransactions(sheets, parsedMessages);
    });
};
