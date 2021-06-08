const {prepareConnection} = require("../helpers/connectionDB.js");
const {validateDriversToCreate} = require("../helpers/validateUserInputs.js");
const {
    ERROR_MSG_API_POST_USER,
    OK_MSG_API_USER_POST
} = require("../const/messages.js");
const {PASSENGER_ROLE, ACTIVE} = require('../const/config.js');

const Register = async (req, res) => {
    const {
        names,
        surname,
        email,
        birthday,
        password1,
        password2,
        goldCheck,
        typeCardSelected,
        cardNumber,
        expirationDate,
        nameSurnameCardOwner,
        documentNumberCardOwner
    } = req.body;

    const inputsErrors = await validateDriversToCreate(email, names, surname, password1, password2, birthday);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();

            let sqlInsert;

            if (goldCheck) {
                sqlInsert =
                    `
                    INSERT INTO USER (NAME, SURNAME, BIRTHDAY, EMAIL, PASSWORD, DATE_TERMS_CONDITIONS, GOLD_MEMBERSHIP_EXPIRATION) 
                    VALUES ('${names}', '${surname}', '${birthday}', '${email}', '${password1}', NULL, DATE_ADD(NOW(), INTERVAL 1 MONTH));
                    `

                const [rows] = await connection.execute(sqlInsert);

                const id = rows.insertId;

                sqlInsert = `INSERT INTO ROLE_USER (ID_ROLE, ID_USER, ACTIVE) VALUES (${PASSENGER_ROLE}, ${id}, ${ACTIVE});`
                connection.execute(sqlInsert);

                sqlInsert =
                    `
                    INSERT INTO CARD (ID_CARD_NETWORK, ID_CARD_TYPE, ID_PASSENGER, NUMBER, NAME_SURNAME, EXPIRATION_DATE, OWNER_DOCUMENT_NUMBER, ACTIVE) 
                    VALUES (${typeCardSelected}, 1, ${id}, '${cardNumber}', '${nameSurnameCardOwner}', '${expirationDate}', '${documentNumberCardOwner}', ${ACTIVE});
                    `;
                connection.execute(sqlInsert);
            } else {
                sqlInsert =
                    `
                    INSERT INTO USER (NAME, SURNAME, BIRTHDAY, EMAIL, PASSWORD, DATE_TERMS_CONDITIONS, GOLD_MEMBERSHIP_EXPIRATION) 
                    VALUES ('${names}', '${surname}', '${birthday}', '${email}', '${password1}', NULL, NULL);
                    `

                const [rows] = await connection.execute(sqlInsert);

                const id = rows.insertId;

                sqlInsert = `INSERT INTO ROLE_USER (ID_ROLE, ID_USER, ACTIVE) VALUES (${PASSENGER_ROLE}, ${id}, ${ACTIVE});`
                connection.execute(sqlInsert);
            }

            connection.end();
            res.status(201).send(OK_MSG_API_USER_POST);
        } catch (error) {
            console.log(`${ERROR_MSG_API_POST_USER} ${error}`);
            res.status(500);
        }
    }

};

module.exports = {
    Register
}
