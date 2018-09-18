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

    addNewMessages = (newMessages) => {
        let rows = [];
        newMessages.forEach(message => {
            message.transactions.forEach(transaction => {
                // format date ISO 8601
                let date = transaction.date.format('YYYY-MM-DD');

                let row = [message.id, date, message.accountName, transaction.type, transaction.label, transaction.category, transaction.amount];
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
    }

    executeNewMessages(sheets, messages,[], addNewMessages);
}

/**
 * Execute a callback only with new messages.
 *
 */
executeNewMessages = (sheets, msg2check, newMsg, callback) => {
    let message = msg2check.pop();

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
 
        let alreadyProcessed = result.data.updatedData.values[0][0];
        if (alreadyProcessed === 'FALSE') {
            newMsg.push(message);
        }

        if (msg2check.length > 0) {
            executeNewMessages(sheets, msg2check, newMsg, callback);
        } else {
            callback(newMsg);
        }
    });
}