const { prepareConnection } = require("../helpers/connectionDB.js");

const {
    validatePassengersToModifyWithNewPassword,
    validatePassengersToModifyWihoutNewPassword
} = require("../helpers/validateUserInputs.js");

const {
    OK_MSG_API_USER_PUT,
    ERROR_MSG_API_PUT_USER
} = require('../const/messages.js');

const userConfigurationWithNewPassword = async (req, res) => {
    const { id } = req.params;
    const { names, surname, email, birthday, newPassword1, newPassword2, actualPassword } = req.body;

    const inputsErrors = await validatePassengersToModifyWithNewPassword(email, names, surname, newPassword1, newPassword2, actualPassword, birthday, id);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlUpdate = "UPDATE USER SET NAME= ?, SURNAME= ?, EMAIL= ?, PASSWORD= ?, BIRTHDAY= ? WHERE USER_ID = ?";
            const [rows] = await connection.execute(sqlUpdate, [names, surname, email, newPassword1, birthday, id]);

            connection.end();
            return res.status(200).send(OK_MSG_API_USER_PUT);
        } catch (error) {
            console.log(`${ERROR_MSG_API_PUT_USER} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_PUT_USER} ${error}`);
        }
    }
    res.end();
};

const userConfigurationWitoutNewPassword = async (req, res) => {
    const { id } = req.params;
    const { names, surname, email, birthday, actualPassword } = req.body;

    const inputsErrors = await validatePassengersToModifyWihoutNewPassword(email, names, surname, actualPassword, birthday, id);
    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlUpdate = "UPDATE USER SET NAME= ?, SURNAME= ?, EMAIL= ?, BIRTHDAY= ? WHERE USER_ID = ?";
            const [rows] = await connection.execute(sqlUpdate, [names, surname, email, birthday, id]);

            connection.end();
            return res.status(200).send(OK_MSG_API_USER_PUT);
        } catch (error) {
            console.log(`${ERROR_MSG_API_PUT_USER} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_PUT_USER} ${error}`);
        }
    }
    res.end();
};

module.exports = {
    userConfigurationWithNewPassword,
    userConfigurationWitoutNewPassword
};
