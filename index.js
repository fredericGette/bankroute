const {google} = require('googleapis');
const authorization = require('./authorization');
const messages = require('./messages');

// Start
authorization.loadCredentials(listMessages);

/**
 * Retrieve Messages in user's mailbox matching query.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listMessages(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const query = 'from:(assistance@linxo.com) subject:notification';

  messages.getPageOfMessages(gmail, query, []);
};
