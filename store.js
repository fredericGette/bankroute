const { google } = require('googleapis');

/**
* Prints the names and majors of students in a sample spreadsheet:
* @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
* @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
*/
exports.listMajors = (auth) => {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1h2EcgcjoNZN_F0lbg4zpTYQnE4xRtM26LP52JdS79hM',
        range: 'transactions!A1:E2',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                console.log(`${row[0]}, ${row[4]}`);
            });
        } else {
            console.log('No data found.');
        }
    });
}

exports.addTransactions = (sheets, data) => {

    let rows = [];
    data.forEach(message => {
        message.transactions.forEach(transaction => {
            let row = [transaction.date, message.accountName, transaction.type, transaction.label, transaction.category, transaction.amount];
            rows.push(row)
        });
    });

    let resource = {
        values: rows
    };

    sheets.spreadsheets.values.append({
        spreadsheetId: '1h2EcgcjoNZN_F0lbg4zpTYQnE4xRtM26LP52JdS79hM',
        range: 'transactions',
        valueInputOption: 'USER_ENTERED',
        resource,
    }, (err, result) => {
        if (err) return console.log(err);

        console.log(`${result.data.updates.updatedCells} cells appended.`);

    });
}