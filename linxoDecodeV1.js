const cheerio = require('cheerio');
const moment = require('moment');

/**
* @param {string} b64string base64 string.
*/
decode64 = (b64string) => {
    return Buffer.from(b64string, 'base64').toString('utf8');
}

/**
 * Get message's ID.
 * 
 * @param {google.gmail.users.message} message
 */
getMessageId = (message) => {
    let headerMessageId = message.data.payload.headers.find(header => {
        return header.name === 'Message-Id';
    });

    return headerMessageId.value;
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
    console.log(`Account name [${accountName}]`);
 
    let transactions = getTransactions($);
    transactions.forEach((transaction, i) => {
        console.log(`Transaction  [${i}]`);
        console.log(`   Type      [${transaction.type}]`);
        console.log(`   Label     [${transaction.label}]`);
        console.log(`   Date      [${transaction.date}]`);
        console.log(`   Category  [${transaction.category}]`);
        console.log(`   Amount    [${transaction.amount}]`);
    });

    let accountBalance = getBalance($);
    console.log(`Balance      [${accountBalance}]`);

//    console.log(body);
    let messageId = getMessageId(message);
    return {
        id: messageId,
        accountName: accountName,
        transactions: transactions
    }
}

/**
 * Find the account name.
 */
getAccountName = (html) => {
    return html('tr[class=nameDuCompte]').first().text().trim();
}

/**
 * Get the list of transactions.
 */
getTransactions = (html) => {

    let transactions = [];

    html('td[class=iconeCategory]').each((i, element) => {
        let transactionHtml = html(element).next();
        let transaction = getTransaction(transactionHtml);
        transactions.push(transaction);
      });

    return transactions;
}

/**
 * Get information of a transaction.
 */
getTransaction = (html) => {
    let typeHtml = html.find('span').first();
    let labelHtml = typeHtml.nextAll('strong');
    let dateCategoryHtml = labelHtml.nextAll('span');
    let amountHtml = html.next().first();

    let test = amountHtml.html();

    let type = typeHtml.text().trim();
    let label = labelHtml.text().trim();
    let dateCategory = dateCategoryHtml.text().trim();
    let indexOfSeparator = dateCategory.indexOf('-');
    let dateString = dateCategory.substring(0,indexOfSeparator).trim();
    let category = dateCategory.substring(indexOfSeparator+1).trim();
    let amountString = amountHtml.text().trim();

    // Parse date
    let date = moment(dateString, 'DD/MM/YYYY');

    // Parse amount
    let amount = parseAmount(amountString);

    return {
        type: type,
        label: label,
        date: date,
        category: category,
        amount: amount
    };
}

/**
 * Get account balance.
 */
getBalance = (html) => {
    let balanceString = html('td[class=meteo]').first().next().next().text().trim();
    return parseAmount(balanceString);
}

/**
 * Parse a string that contains an amount in french local and in Euro.
 */
parseAmount = (amountString) => {
    let transformedString = amountString.replace(/\s/g,'').replace(',','.').replace('€','');
    return Number.parseFloat(transformedString);
}