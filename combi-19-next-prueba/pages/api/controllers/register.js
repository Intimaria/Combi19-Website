const { prepareConnection } = require("../helpers/connectionDB.js");
const { validatePassengers } = require("../helpers/validateUserInputs.js");
const { OK_MSG_USER_CREATED } = require("../const_back/messages.js");
const { PASSENGER_ROLE, ACTIVE } = require('../const_back/config.js');

const Register = async (req, res) => {
    const {names, surname, email, birthday, password1, password2} = req.body;

    const inputsErrors = await validatePassengers(email, names, surname, password1, password2, birthday);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();

            let sqlInsert = "INSERT INTO USER (NAME, SURNAME, BIRTHDAY, EMAIL, PASSWORD, DATE_TERMS_CONDITIONS, GOLD_MEMBERSHIP_EXPIRATION) VALUES (?,?,?,?,?,?,?)"
            const [rows] = await connection.execute(sqlInsert, [names, surname, birthday, email, password1, null, null]);

            const id = rows.insertId;
            sqlInsert = 'INSERT INTO ROLE_USER (ID_ROLE, ID_USER, ACTIVE) VALUES (?,?,?)'
            connection.execute(sqlInsert, [PASSENGER_ROLE, id, ACTIVE]);

            connection.end();
            res.status(201).send(OK_MSG_USER_CREATED);
        } catch (error) {
            console.log("Ocurrió un error al insertar el usuario:", error);
            res.status(500);
        }
    }

};

module.exports = {
    Register
}
