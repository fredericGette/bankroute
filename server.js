'use strict';

const express = require('express');

const {google} = require('googleapis');
const authorizationService = require('./authorization');
const messagesService = require('./messages');
const parser = require('./linxoParserV1');
const persister = require('./persister');
const categorizer = require('./categorizer');

const app = express();

// Cloud Shell
// cd bankroute
// git pull
// gcloud app deploy


app.get('/cron', (req, res) => {
  authorizationService.loadCredentials(listMessages);
  res.status(200).send('Hello, world!').end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

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
  
        categorizer.categorize(parsedMessages);
  
        persister.addTransactions(sheets, parsedMessages);
      });
  };