require('dotenv').config();

const jwt = require('jsonwebtoken');

const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    EXPIRY_TIME,
    ADMIN_ROLE,
    DRIVER_ROLE,
    PASSENGER_ROLE
} = require('../const_back/config');

const {
    ERROR_MSG_INVALID_LOGIN
} = require('../const_back/messages');

let userData = {userName: '', userSurname: '', userEmail: '', userRoleId: []};

const verifyAccount = async (req) => {
    const {email, password} = req.body;

    try {
        const connection = await prepareConnection();

        const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL FROM USER WHERE BINARY EMAIL = (?) AND BINARY PASSWORD = (?)';
        const [rows, fields] = await connection.execute(sqlSelect, [email, password]);

        connection.end();

        if (rows.length === 1) {
            userData.userName = rows[0].NAME;
            userData.userSurname = rows[0].SURNAME;
            userData.userEmail = rows[0].EMAIL;
            return rows[0].USER_ID;
        }
    } catch (error) {
        console.log("Ocurrió un error al verificar la cuenta:", error);
        return false;
    }
}

const verifyRole = async (verifiableRoles, userId) => {
    try {
        const connection = await prepareConnection();

        const sqlSelect = 'SELECT ID_ROLE FROM ROLE_USER WHERE ID_USER = (?)';
        const [rows, fields] = await connection.execute(sqlSelect, [userId]);

        connection.end();

        for (let index = 0; index < rows.length; index++) {
            if (verifiableRoles.includes(rows[index].ID_ROLE)) {
                userData.userRoleId.push(rows[index].ID_ROLE);
            }
        }
        return userData.userRoleId.length !== 0;
    } catch (error) {
        console.log("Ocurrió un error al verificar el rol:", error);
        return false;
    }
}

const Login = async (req, res, verifiableRoles) => {
    userData = {userName: '', userSurname: '', userEmail: '', userRoleId: []};

    const userId = await verifyAccount(req);

    if (userId && await verifyRole(verifiableRoles, userId)) {
        const token = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: EXPIRY_TIME});
        return res.status(200).send({token, userData});
    } else {
        res.status(400).send(ERROR_MSG_INVALID_LOGIN);
    }
    res.end();
}

const LoginPassengers = async (req, res) => {
    Login(req, res, [PASSENGER_ROLE]);
}

const LoginEmployees = async (req, res) => {
    Login(req, res, [ADMIN_ROLE, DRIVER_ROLE]);
}

module.exports = {
    LoginPassengers,
    LoginEmployees
}
