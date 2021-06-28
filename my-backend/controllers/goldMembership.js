const {prepareConnection} = require("../helpers/connectionDB.js");

const {ACTIVE} = require('../const/config.js');

const {
    OK_MSG_API_POST_GOLD_MEMBERSHIP,
    ERROR_MSG_API_POST_GOLD_MEMBERSHIP,
    OK_MSG_API_PUT_GOLD_MEMBERSHIP,
    ERROR_MSG_API_PUT_GOLD_MEMBERSHIP,
} = require("../const/messages");

const postGoldMembership = async (req, res) => {
    const {
        userId,
        typeCardSelected,
        cardNumber,
        expirationDate,
        nameSurnameCardOwner,
        documentNumberCardOwner
    } = req.body;

    try {
        const connection = await prepareConnection();

        let sqlUpdate =
            `
                UPDATE USER 
                SET GOLD_MEMBERSHIP_EXPIRATION = DATE_ADD(NOW(), INTERVAL 1 MONTH),
                AUTOMATIC_DEBIT = 1
                WHERE USER_ID = ${userId};
              `;

        await connection.execute(sqlUpdate);

        let sqlInsert =
            `
                    INSERT INTO CARD (ID_CARD_NETWORK, ID_CARD_TYPE, ID_PASSENGER, NUMBER, NAME_SURNAME, EXPIRATION_DATE, OWNER_DOCUMENT_NUMBER, ACTIVE) 
                    VALUES (${typeCardSelected}, 1, ${userId}, '${cardNumber}', '${nameSurnameCardOwner}', '${expirationDate}', '${documentNumberCardOwner}', ${ACTIVE});
                    `;
        connection.execute(sqlInsert);

        connection.end();
        res.status(201).send(OK_MSG_API_POST_GOLD_MEMBERSHIP);
    } catch (error) {
        console.log(`${ERROR_MSG_API_POST_GOLD_MEMBERSHIP} ${error}`);
        res.status(500);
    }

};

const putGoldMembership = async (req, res) => {
    const {id} = req.params;

    const {automaticDebit} = req.body;

    try {
        const connection = await prepareConnection();

        let sqlUpdate =
            `
                UPDATE USER 
                SET AUTOMATIC_DEBIT = ${automaticDebit}
                WHERE USER_ID = ${id};
              `;

        await connection.execute(sqlUpdate);

        connection.end();
        res.status(200).send(OK_MSG_API_PUT_GOLD_MEMBERSHIP);
    } catch (error) {
        console.log(`${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${error}`);
    }

    res.end();
};

module.exports = {
    postGoldMembership,
    putGoldMembership
};
