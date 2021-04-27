const { prepareConnection } = require("../helpers/connectionDB.js");
const { validatePassengers } = require("../helpers/validateInputs.js");
const { OK_MSG_USER_CREATED } = require("../const/messages");

const Register = async (req, res) => {
    const {names, surname, email, birthday, password1, password2} = req.body;

    const inputsErrors = await validatePassengers(email, names, surname, password1, password2, birthday);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();

            let sqlInsert = "INSERT INTO `USER`(`NAME`, `SURNAME`, `BIRTHDAY`, `EMAIL`, `PASSWORD`, `DATE_TERMS_CONDITIONS`, `GOLD_MEMBERSHIP_EXPIRATION`) VALUES (?,?,?,?,?,?,?)"
            const [rows] = await connection.execute(sqlInsert, [names, surname, birthday, email, password1, null, null]);

            const id = rows.insertId;
            sqlInsert = 'INSERT INTO `ROLE_USER`(`ID_ROLE`, `ID_USER`) VALUES (?,?)'
            connection.execute(sqlInsert, [3, id]);

            connection.end();
            res.status(201).send(OK_MSG_USER_CREATED);
        } catch (e) {
            console.log("Ocurrió un error al insertar el usuario:", e);
        }
    }

};

module.exports = {
    Register
}
