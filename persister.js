const { google } = require('googleapis');
const SPREADSHEET_ID = '1h2EcgcjoNZN_F0lbg4zpTYQnE4xRtM26LP52JdS79hM';

/**
 * Add information from the messages to the spreadsheet.
 * Information are added only when they don't alredy exist in the spreadsheet.
 * 
 * @param {goole.sheets} sheets 
 * @param {*} messages 
 */
exports.addTransactions = (sheets, messages) => {

    filterNewMessages(sheets, messages,[]
        , (newMessages) => {
            let rows = [];
            newMessages.forEach(message => {
                message.accounts.forEach(account => {
                    account.transactions.forEach(transaction => {
                        // format date ISO 8601
                        let transactionDate = transaction.date.format('YYYY-MM-DD');
    
                        let row = [message.id, transactionDate, account.name, transaction.type, transaction.label, transaction.category, transaction.amount, transaction.category2];
                        rows.push(row)
                    });    
                    let balanceDate = message.date.format('YYYY-MM-DD');
                    let row = [message.id, balanceDate, account.name, 'Balance', '', '', account.balance];
                    rows.push(row)
                });
            });
        
            sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: 'transactions',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: rows
                },
            }, (err, result) => {
                if (err) return console.log(err);
        
                console.log(`${result.data.updates.updatedCells} cells appended.`);
        
            });    
        });
}

/**
 * Execute a callback only with new messages.
 *
 */
filterNewMessages = (sheets, inputMessages, outputMessages, callback) => {
    let message = inputMessages.pop();

    sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'lookup!A10',
        valueInputOption: 'USER_ENTERED',
        includeValuesInResponse: true,
        resource: {
            values: [
                ['=NOT(ISNA(VLOOKUP("'+message.id+'", transactions!A:A, 1, false)))']
            ]
        }
    }, (err, result) => {
        if (err) return console.log(err);
 
        console.log(`Check message [${inputMessages.length+1}]`);

        let alreadyProcessed = result.data.updatedData.values[0][0];
        if (alreadyProcessed === 'FALSE') {
            outputMessages.push(message);
        }

        if (inputMessages.length > 0) {
            filterNewMessages(sheets, inputMessages, outputMessages, callback);
        } else {
            callback(outputMessages);
        }
    });
}