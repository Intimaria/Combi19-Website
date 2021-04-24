require('dotenv').config();

const jwt = require('jsonwebtoken');
const { prepareConnection } = require("../helpers/connectionDB.js");
const expiryTime = '2h'
let userData = { userName: '', userSurname: '', userEmail: '', userRoleId: [] };

const verifyAccount = async (req) => {
    const { email, password } = req.body;
    const connection = await prepareConnection();
    const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL FROM `user` WHERE BINARY `EMAIL` = (?) AND BINARY `PASSWORD` = (?)';
    const [rows, fields] = await connection.execute(sqlSelect, [email, password]);
    connection.end();
    if (rows.length === 1) {
        userData.userName = rows[0].NAME;
        userData.userSurname = rows[0].SURNAME;
        userData.userEmail = rows[0].EMAIL;
        return rows[0].USER_ID;
    }
    return null;
}

const verifyRole = async (verifiableRoles, userId) => {
    const connection = await prepareConnection();
    const sqlSelect = 'SELECT `ID_ROLE` FROM `role_user` WHERE `ID_USER` = (?)';
    const [rows, fields] = await connection.execute(sqlSelect, [userId]);
    connection.end();
    for (let index = 0; index < rows.length; index++) {
        if (verifiableRoles.includes(rows[index].ID_ROLE)) {
            userData.userRoleId.push(rows[index].ID_ROLE);
        } 
    }
    return userData.userRoleId.length !== 0;
}

const Login = async (req, res, verifiableRoles) => {
    userData = { userName: '', userSurname: '', userEmail: '', userRoleId: [] };
    const userId = await verifyAccount(req);
    if (userId && await verifyRole(verifiableRoles, userId)) {
        const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
        return res.status(200).send({ token, userData });
    }
    else {
        res.status(400).send("El correo y/o contraseña son incorrectos");
    }
    da
    res.end();
}

const LoginPassengers = async (req, res) => {
    Login(req, res, [3]);
}

const LoginEmployees = async (req, res) => {
    Login(req, res, [1, 2]);
}

module.exports = {
    LoginPassengers,
    LoginEmployees
}