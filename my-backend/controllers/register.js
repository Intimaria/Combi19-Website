const { prepareConnection } = require("../helpers/connectionDB.js");
const { validate } = require("../helpers/validateRegisterInputs.js");

const Register = async (req, res) => {
    const { names, surname, email, birthday, password1, password2 } = req.body;

    const inputsErrors = await validate(email, names, surname, password1, password2, birthday);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    }
    else {
        const connection = await prepareConnection();
        let sqlInsert = "INSERT INTO `USER`(`NAME`, `SURNAME`, `BIRTHDAY`, `EMAIL`, `PASSWORD`, `DATE_TERMS_CONDITIONS`, `GOLD_MEMBERSHIP_EXPIRATION`) VALUES (?,?,?,?,?,?,?)"
        const [rows] = await connection.execute(sqlInsert, [names, surname, birthday, email, password1, null, null]);

        const id = rows.insertId;
        sqlInsert = 'INSERT INTO `ROLE_USER`(`ID_ROLE`, `ID_USER`) VALUES (?,?)'
        connection.execute(sqlInsert, [3,id]);
        
        connection.end();
        res.status(201).send("Se ha creado el usuario con éxito");
    }

};

module.exports = {
    Register
}
