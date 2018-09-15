const {google} = require('googleapis');
const authorizationService = require('./authorization');
const messagesService = require('./messages');
const decoder = require('./linxoDecodeV1');

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

  callbackDecode = (messages) => {
    decoder.decode(messages[4]);
  }

  messagesService.getMessages(gmail, query, callbackDecode);

};
