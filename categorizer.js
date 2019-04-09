
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
    setFromCategory(transaction, /^Virements internes$/,    'Virements');
    setFromCategory(transaction, /^Frais bancaires$/,       'Frais banque');

    setFromLabel(transaction, /^.*FINANCES PUBLIQUES$/,     'Impôts');
    setFromLabel(transaction, /^EDF CLIENTS PARTICULIERS$/, 'Electricité');
    setFromLabel(transaction, /^.*ALLIANZ.*$/,              'Ass. Maison');
    setFromLabel(transaction, /^AVANSSUR$/,                 'Voiture');
    setFromLabel(transaction, /^GARAGE DU LION$/,           'Voiture');
    setFromLabel(transaction, /^DAC INTERMARCHE$/,          'Voiture');
    setFromLabel(transaction, /^STAT INTERMARCHE$/,         'Voiture');
    setFromLabel(transaction, /^RELAIS DU DOUBS$/,          'Voiture');
    setFromLabel(transaction, /^GARAGE JOBIN SARL$/,        'Voiture');
    setFromLabel(transaction, /^R PTE HTES VOSGE$/,         'Voiture');
    setFromLabel(transaction, /^RELAIS DU DOUBS$/,          'Voiture');
    setFromLabel(transaction, /^LA RESIDENCE$/,             'Voiture');
    setFromLabel(transaction, /^APRR$/,                     'Voiture');
    setFromLabel(transaction, /^ESSFLO.*$/,                 'Voiture');
    setFromLabel(transaction, /^SNCF INTERNET$/,            'Train');
    setFromLabel(transaction, /^.* TRAINS.*$/,              'Train');
    setFromLabel(transaction, /^BOUTIQUE SOSH$/,            'Télécom');
    setFromLabel(transaction, /^BOUYGUES TELECOM$/,         'Télécom');
    setFromLabel(transaction, /^.*ORANGE.*$/,               'Télécom');
    setFromLabel(transaction, /^SFR FIXE ADSL$/,            'Télécom');
    setFromLabel(transaction, /^NETFLIX COM$/,              'Vidéos');
    setFromLabel(transaction, /^GOOGLE YOUTUBE VIDEOS$/,    'Vidéos');
    setFromLabel(transaction, /^MONDIAL RELAY$/,            'Envois');
    setFromLabel(transaction, /^LA POSTE BOUTIQU$/,         'Envois');
    setFromLabel(transaction, /^BOURDET$/,                  'Envois');
    setFromLabel(transaction, /^EBAY EUROPE SARL$/,         'Achats');
    setFromLabel(transaction, /^PP\*.*CODE$/,               'Achats');
    setFromLabel(transaction, /^PAYPAL$/,                   'Achats');
    setFromLabel(transaction, /^AMAZON\.FR$/,               'Achats');
    setFromLabel(transaction, /^AMZN MKTP FR$/,             'Achats');
    setFromLabel(transaction, /^LDLC COM$/,                 'Achats');
    setFromLabel(transaction, /^.*ZALANDO.*$/,              'Achats');
    setFromLabel(transaction, /^.*BOUCHERIE.*$/,            'Alimentaire');
    setFromLabel(transaction, /^VAL ET LOMONT$/,            'Alimentaire');
    setFromLabel(transaction, /^LIDL.*$/,                   'Alimentaire');
    setFromLabel(transaction, /^COLRUYT.*$/,                'Alimentaire');
    setFromLabel(transaction, /^INTERMARCHE$/,              'Alimentaire');
    setFromLabel(transaction, /^LA CRAQUANTE$/,             'Alimentaire');
    setFromLabel(transaction, /^BRICOMARCHE$/,              'Achats');
    setFromLabel(transaction, /^YR PAYLINE$/,               'Achats');
    setFromLabel(transaction, /^AB'SOLU$/,                  'Coiffeur');
    setFromLabel(transaction, /^DR VINCENT.*$/,             'Santé');
    setFromLabel(transaction, /^.*FILHET-ALLARD.*$/,        'Santé');
    setFromLabel(transaction, /^.*C\.P\.A\.M.*$/,           'Santé');
    setFromLabel(transaction, /^CUISINE ADDICT$/,           'Achats');
    setFromLabel(transaction, /^CERF DELLIER$/,             'Achats');
    setFromLabel(transaction, /^FRANCOISE SAGET$/,          'Achats');
    setFromLabel(transaction, /^PHOTOWEB$/,                 'Achats');
    setFromLabel(transaction, /^.*HOTEL.*$/,                'Hotel');
    setFromLabel(transaction, /^.*BENTINCK.*$/,             'Hotel');
    setFromLabel(transaction, /^3B SOCHAUX$/,               'Restaurant');
    setFromLabel(transaction, /^.*MUTAVIE.*$/,              'Epargne');
    setFromLabel(transaction, /^.*FREDERIC GETTE.*$/,       'Epargne');
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