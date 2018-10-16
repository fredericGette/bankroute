
/**
 * Add a new category to the transactions.
 * @param {*} messages 
 */
exports.categorize = (messages) => {

    messages.forEach(message => {
        message.accounts.forEach(account => {
            account.transactions.forEach(transaction => {
                addCategory2(transaction);
            });
        });
    });
};

/**
 * Add "category2" to a transaction.
 */
addCategory2 = (transaction) => {

    // Default
    setFromCategory(transaction, /^.*$/,                    transaction.label);

    setFromCategory(transaction, /^Chèques$/,               'Chq '+transaction.label.substring(7));
    setFromCategory(transaction, /^Retraits d'espèces$/,    'Retr. argent');
    setFromCategory(transaction, /^Virements internes$/,    'Vir. Crédit Mut.');
    setFromCategory(transaction, /^Frais bancaires$/,       'Frais banque');

    setFromLabel(transaction, /^.*FINANCES PUBLIQUES$/,     'Impôts');
    setFromLabel(transaction, /^EDF CLIENTS PARTICULIERS$/, 'Electricité');
    setFromLabel(transaction, /^AVANSSUR$/,                 'Ass. voiture');
    setFromLabel(transaction, /^DAC INTERMARCHE$/,          'Essence');
    setFromLabel(transaction, /^STAT INTERMARCHE$/,         'Essence');
    setFromLabel(transaction, /^SNCF INTERNET$/,            'Train');
    setFromLabel(transaction, /^BOUTIQUE SOSH$/,            'Téléphone');
    setFromLabel(transaction, /^BOUYGUES TELECOM$/,         'Téléphone');
    setFromLabel(transaction, /^SFR FIXE ADSL$/,            'Internet');
    setFromLabel(transaction, /^NETFLIX COM$/,              'Netflix');
    setFromLabel(transaction, /^MONDIAL RELAY$/,            'Mondial Relay');
    setFromLabel(transaction, /^LA POSTE BOUTIQU$/,         'La Poste');
    setFromLabel(transaction, /^EBAY EUROPE SARL$/,         'Ebay');
    setFromLabel(transaction, /^PP\*.*CODE$/,               'Paypal');
    setFromLabel(transaction, /^PAYPAL$/,                   'Paypal');
    setFromLabel(transaction, /^AMAZON\.FR$/,               'Amazon');
    setFromLabel(transaction, /^AMZN MKTP FR$/,             'Amazon');
    setFromLabel(transaction, /^ZALANDO.*$/,                'Zalando');
    setFromLabel(transaction, /^VAL ET LOMONT$/,            'Fromagerie');
    setFromLabel(transaction, /^LIDL.*$/,                   'Lidl');
    setFromLabel(transaction, /^COLRUYT.*$/,                'Colruyt');
    setFromLabel(transaction, /^INTERMARCHE$/,              'Intermarché');
    setFromLabel(transaction, /^BRICOMARCHE$/,              'Bricomarché');
    setFromLabel(transaction, /^YR PAYLINE$/,               'Yves Rocher');
    setFromLabel(transaction, /^AB'SOLU$/,                  'Coiffeur');
    setFromLabel(transaction, /^DR VINCENT.*$/,             'Dentiste');
    setFromLabel(transaction, /^CUISINE ADDICT$/,           'Cuisine Addict');
    setFromLabel(transaction, /^CERF DELLIER$/,             'Cerf Dellier');
    setFromLabel(transaction, /^FRANCOISE SAGET$/,          'Françoise Saget');
    setFromLabel(transaction, /^PHOTOWEB$/,                 'PhotoWeb');

}

/**
 * Add "category2" depending on "category".
 */
setFromCategory = (transaction, category, category2) => {
    if (transaction.category.match(category)) {
        transaction.category2 = category2;
    }
}

/**
 * Add "category2" depending on "label".
 */
setFromLabel = (transaction, label, category2) => {
    if (transaction.label.match(label)) {
        transaction.category2 = category2;
    }
}