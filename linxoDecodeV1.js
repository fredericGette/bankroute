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
    return {
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

/**
 * Get account balance.
 */
getBalance = (html) => {
    return html('td[class=meteo]').first().next().next().text().trim();
}