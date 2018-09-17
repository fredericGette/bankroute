const {google} = require('googleapis');
const authorizationService = require('./authorization');
const messagesService = require('./messages');
const decoder = require('./linxoDecodeV1');
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

  callbackDecode = (messages) => {
    let decodedMessages = [];
    messages.forEach((message, index) => {
      console.log(`------------------------------------------------------`);
      console.log(`Message [${index}]`);
      decodedMessages.push(decoder.decode(message));
    });

    store.addTransactions(sheets, decodedMessages);
  }

  messagesService.getMessages(gmail, query, callbackDecode);
  
};
