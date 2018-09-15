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

    let accountName = getAccountName($);
    console.log(`account name:${accountName}`);
 
    let iconHtml = $('td[class=iconeCategory]');
    let transactionHtml = iconHtml.next();

    let transaction = getTransaction(transactionHtml);

    console.log(`transaction type    :${transaction.type}`);
    console.log(`transaction label   :${transaction.label}`);
    console.log(`transaction date    :${transaction.date}`);
    console.log(`transaction category:${transaction.category}`);
    console.log(`transaction amount  :[${transaction.amount}]`);

    console.log(body);
}

getAccountName = (html) => {
    return html('tr[class=nameDuCompte]').text().trim();
}

getTransaction = (html) => {
    let typeHtml = html.find('span').first();
    let labelHtml = typeHtml.nextAll('strong');
    let dateCategoryHtml = labelHtml.nextAll('span');
    let amountHtml = html.next();

    let type = typeHtml.text().trim();
    let label = labelHtml.text().trim();
    let dateCategory = dateCategoryHtml.text().trim();
    let indexOfSeparator = dateCategory.indexOf('-');
    let date = dateCategory.substring(0,indexOfSeparator).trim();
    let category = dateCategory.substring(indexOfSeparator+1).trim();
    let amount = amountHtml.text().trim();

    return {
        type: type,
        label: label,
        date: date,
        category: category,
        amount: amount
    };
}