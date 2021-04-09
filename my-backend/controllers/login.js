require('dotenv').config();

const jwt = require('jsonwebtoken');
const { prepareConnection } = require("../helpers/connectionDB.js");

const verifyAccount = async (req) => {
    const { email, password } = req.body;
    const connection = await prepareConnection();
    const sqlInsert = 'SELECT * FROM `user` WHERE BINARY `EMAIL` = (?) AND BINARY `PASSWORD` = (?)';
    const [rows, fields] = await connection.execute(sqlInsert, [email, password]);
    connection.end();
    return rows.length === 1 ? rows[0].USER_ID : null;
}

const verifyRole = async (role_id, user_id) => {
    const connection = await prepareConnection();
    const sqlSelect = 'SELECT * FROM `role_user` WHERE `ID_ROLE` = (?) AND `ID_USER` = (?)';
    const [rows, fields] = await connection.execute(sqlSelect, [role_id, user_id]);
    connection.end();
    return rows.length === 1;
}

const Login = async (req, res) => {
    const id = await verifyAccount(req);
    const userRole = 3;
    if (id && await verifyRole(userRole, id)) {
        const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
        return res.status(200).send({ token });
    }
    else {
        res.status(400).send("El correo y/o contraseña son incorrectos");
    }
    res.end();
}

const LoginEmployees = async (req, res) => {
    const id = await verifyAccount(req);
    const adminRole = 1;
    const driverRole = 2;
    if (id && (await verifyRole(adminRole, id) || await verifyRole(driverRole, id))) {
        const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
        return res.status(200).send({ token });
    }
    else {
        res.status(400).send("El correo y/o contraseña son incorrectos");
    }
    res.end();
}

module.exports = {
    Login,
    LoginEmployees
}