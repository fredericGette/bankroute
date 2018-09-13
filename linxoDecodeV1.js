const cheerio = require('cheerio');

/**
* @param {string} b64string base64 string.
*/
decode64 = (b64string) => {
    return Buffer.from(b64string, 'base64').toString('utf8');
}

/**
 * Decode a Linxo notification
 * 
 * @param {google.gmail.users.message} message
 */
exports.decode = (message) => {
    const body = decode64(message.data.payload.body.data)
    const $ = cheerio.load(body);

    let test = $('tr[class=nameDuCompte]').text();
    console.log(test);
}