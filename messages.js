/**
 * Get a page of messages.
 * @param {google.gmail} gmail
 * @param {string} query
 * @param {Array} messages
 * @param {string?} nextPageToken
 */
exports.getPageOfMessages = (gmail, query, messages, nextPageToken) => {
    var params = {userId: 'me', q: query};
    if (nextPageToken) {
      params['pageToken'] = nextPageToken;
    }
    gmail.users.messages.list(params
    , (err,res) => {
      if (err) return console.log('The API returned an error: ' + err);

      messages = messages.concat(res.data.messages);
      if (res.data.nextPageToken) {
        exports.getPageOfMessages(gmail, query, messages, res.data.nextPageToken);
      } else {
        getMessage1By1(gmail, messages);
      }
    });
  }

  /**
   * Get Gmail messages one by one.
   *
   * @param {google.gmail} gmail
   * @param {Array} messages Array of messages.
   */
  getMessage1By1 = (gmail, messages) => {
    if (messages.length>0) {
      gmail.users.messages.get({userId: 'me', id: messages.pop().id}
      , (err,res) => {
        if (err) return console.log('The API returned an error: ' + err);

        console.log(`result ${messages.length}: ${res.data.snippet}`);
        getMessage1By1(gmail, messages);
      });
    } else {
      console.log("End.");
    }
  };
