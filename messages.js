

exports.getMessages = (gmail, query, callback) => {

  callbackGetHeavyMessages = (lightMessages) => {
    getMessage1By1(gmail, lightMessages, [], callback);
  }

  getPageOfMessages(gmail, query, [], callbackGetHeavyMessages);
}

/**
 * Get a page of "light" messages.
 * @param {google.gmail} gmail
 * @param {string} query
 * @param {Array} lightMessages List of "light" messages : only id and thread id.
 * @param {function} callback
 * @param {string?} nextPageToken
 */
getPageOfMessages = (gmail, query, lightMessages, callback, nextPageToken) => {
  var params = { userId: 'me', q: query };
  if (nextPageToken) {
    params['pageToken'] = nextPageToken;
  }
  gmail.users.messages.list(params
    , (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);

      lightMessages = lightMessages.concat(res.data.messages);
      if (res.data.nextPageToken) {
        getPageOfMessages(gmail, query, lightMessages, callback, res.data.nextPageToken);
      } else {
        callback(lightMessages);
      }
    });
}

/**
 * Get Gmail messages one by one.
 *
 * @param {google.gmail} gmail
 * @param {Array} lightMessages List of "light" messages to get: only id and thread id.
 * @param {Array} heavyMessages List of "heavy" messages to return: full information and content of the message.
 * @param {function} callback
 */
getMessage1By1 = (gmail, lightMessages, heavyMessages, callback) => {
  if (lightMessages.length > 0) {

    // Get message Id and remove the corresponding "light" message from the list.
    let messageId = lightMessages.pop().id;

    // Get "heavy" message.
    gmail.users.messages.get({ userId: 'me', id: messageId }
      , (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);

        // Add the "heavy" message to the list.
        heavyMessages.push(res);
        console.log(`get message ${heavyMessages.length}`);

        // Get next message
        getMessage1By1(gmail, lightMessages, heavyMessages, callback);
      });
  } else {
    console.log("No more message.");
    callback(heavyMessages);
  }
};

