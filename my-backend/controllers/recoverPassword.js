const { prepareConnection } = require("../helpers/connectionDB.js");

const {
    validatePassengerEmailToRecoverPassword,
    validatePassengerNewRecoveredPassword
} = require("../helpers/validateUserInputs.js");
const {
    ACTIVE
} = require("../const/config.js")
const {
    ERROR_MSG_API_GET_EMAIL_USER,
    ERROR_MSG_API_POST_RECOVERED_PASSWORD_USER,
    OK_MSG_API_USER_RECOVERED_PASSWORD
} = require('../const/messages.js');

const getEmailToRemindPassword = async (req, res) => {
    const { email } = req.body;

    const inputsErrors = validatePassengerEmailToRecoverPassword(email);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlSelect = 'SELECT EMAIL FROM USER u INNER JOIN ROLE_USER ru ON (ru.ID_USER = u.USER_ID) WHERE BINARY u.EMAIL = (?) AND ru.ACTIVE = (?)';
            const [rows] = await connection.execute(sqlSelect, [email, ACTIVE]);

            connection.end();
            return res.status(200).send(rows.length === 1);
        } catch (error) {
            console.log(`${ERROR_MSG_API_GET_EMAIL_USER} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_GET_EMAIL_USER} ${error}`);
        }
    }
    res.end();
};

const postNewRecoveredPassword = async (req, res) => {
    const { email, passwordRevocered1, passwordRevocered2 } = req.body;

    const inputsErrors = validatePassengerNewRecoveredPassword(email, passwordRevocered1, passwordRevocered2 );
    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlUpdate = "UPDATE USER SET PASSWORD= ? WHERE BINARY EMAIL = ?";
            const [rows] = await connection.execute(sqlUpdate, [passwordRevocered1, email]);

            connection.end();
            return res.status(200).send(OK_MSG_API_USER_RECOVERED_PASSWORD);
        } catch (error) {
            console.log(`${ERROR_MSG_API_POST_RECOVERED_PASSWORD_USER} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_POST_RECOVERED_PASSWORD_USER} ${error}`);
        }
    }
    res.end();
};

module.exports = {
    getEmailToRemindPassword,
    postNewRecoveredPassword
};
