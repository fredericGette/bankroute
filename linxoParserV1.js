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
 * Get message's date.
 * 
 * @param {google.gmail.users.message} message
 */
getMessageDate = (message) => {
    let headerMessageDate = message.data.payload.headers.find(header => {
        return header.name === 'Date';
    });

    return moment(headerMessageDate.value);
}

/**
 * Decode a Linxo notification
 * 
 * @param {google.gmail.users.message} message
 */
exports.parse = (message) => {
    const body = decode64(message.data.payload.body.data)
    const html = cheerio.load(body);

    let parsedMessage = {};
    parsedMessage.id =  getMessageId(message);
    parsedMessage.date = getMessageDate(message);

    // Iterates over the accounts contained in the message.
    parsedMessage.accounts = [];
    html('tr[class=notifications]').each((i,element) => {
        let account = {};
        account.name = getAccountName(html(element));
        console.log(`  Account [${i}]`);
        console.log(`    Name    [${account.name}]`);
        account.balance = getBalance(html(element));
        console.log(`    Balance [${account.balance}]`);

        account.transactions = getTransactions(html(element));
        account.transactions.forEach((transaction, i) => {
            console.log(`    Transaction  [${i}]`);
            console.log(`       Type      [${transaction.type}]`);
            console.log(`       Label     [${transaction.label}]`);
            console.log(`       Date      [${transaction.date}]`);
            console.log(`       Category  [${transaction.category}]`);
            console.log(`       Amount    [${transaction.amount}]`);
        });

        parsedMessage.accounts.push(account);
    });

    return parsedMessage;
}

/**
 * Find the account name.
 */
getAccountName = (html) => {
    return html.find('tr[class=nameDuCompte]').first().text().trim();
}

/**
 * Get the list of transactions.
 */
getTransactions = (html) => {

    let transactions = [];

    html.find('td[class=iconeCategory]').each((i, element) => {
        let transactionHtml = html.find(element).next();
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
    let balanceString = html.find('strong:contains("Solde")').parent().parent().next().text().trim();
    return parseAmount(balanceString);
}

/**
 * Parse a string that contains an amount in french local and in Euro.
 */
parseAmount = (amountString) => {
    let transformedString = amountString.replace(/\s/g,'').replace(',','.').replace('€','');
    return Number.parseFloat(transformedString);
}