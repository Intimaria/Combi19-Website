const {prepareConnection} = require("../helpers/connectionDB.js");

const {validateDriversToCreate, validateDriversToModify} = require("../helpers/validateUserInputs.js");

const {validateDriverTransportDependence} = require('../helpers/validateDriverDependences.js');

const {normalizeDrivers} = require('../helpers/normalizeResult.js');

// const { validateDriverTripDependence } = require('../helpers/validateDriverDependences.js');

const {
    DRIVER_ROLE,
    NO_ACTIVE,
    ACTIVE
} = require('../const/config.js');

const {
    ERROR_MSG_API_GET_DRIVERS,
    ERROR_MSG_API_GET_DRIVER_BY_ID,
    OK_MSG_API_POST_DRIVER,
    ERROR_MSG_API_POST_DRIVER,
    OK_MSG_API_PUT_DRIVER,
    ERROR_MSG_API_PUT_DRIVER,
    OK_MSG_API_DELETE_DRIVER,
    ERROR_MSG_API_DELETE_DRIVER,
    ERROR_MSG_API_DELETE_DRIVER_TRANSPORT_DEPENDENCE
} = require('../const/messages.js');

const getDrivers = async (req, res) => {
    // const { start = 1, limit = 5 } = req.query;
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL, PHONE_NUMBER, PASSWORD, ACTIVE FROM USER a INNER JOIN ROLE_USER r ON (a.USER_ID = r.ID_USER) WHERE r.ID_ROLE = ? ORDER BY SURNAME ASC, NAME ASC';
        const [rows] = await connection.execute(sqlSelect, [DRIVER_ROLE]);
        connection.end();
        const normalizedResults = await normalizeDrivers(rows);
        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);
    }
    res.end();
};

const getDriverById = async (req, res) => {
    try {
        const {id} = req.params;
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL, PASSWORD, PHONE_NUMBER, ACTIVE FROM USER a INNER JOIN ROLE_USER r ON (a.USER_ID = r.ID_USER) WHERE r.ID_ROLE = ? AND a.USER_ID = ?';
        const [rows, fields] = await connection.execute(sqlSelect, [DRIVER_ROLE, id]);
        connection.end();
        return res.status(200).send(rows[0]);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_DRIVER_BY_ID} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_DRIVER_BY_ID} ${error}`);
    }
    res.end();
};

const getAvailableDrivers = async (req, res) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect =
            `
                SELECT u.USER_ID user_id, u.NAME name, u.SURNAME surname
                FROM USER u
                INNER JOIN ROLE_USER ru ON u.USER_ID = ru.ID_USER
                LEFT JOIN TRANSPORT t ON u.USER_ID = t.ID_DRIVER
                WHERE ru.ACTIVE = 1
                AND ru.ID_ROLE = 2
                AND t.TRANSPORT_ID IS NULL
                ORDER BY u.SURNAME ASC, u.NAME ASC;
                `;
        const [rows] = await connection.execute(sqlSelect, [DRIVER_ROLE]);
        connection.end();
        return res.status(200).send(rows);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_DRIVERS} ${error}`);
    }
    res.end();
}

const postDriver = async (req, res) => {
    const {names, surname, email, phoneNumber, password1, password2} = req.body;

    const inputsErrors = await validateDriversToCreate(email, names, surname, password1, password2, phoneNumber);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlInsert = "INSERT INTO USER(NAME, SURNAME, EMAIL, PASSWORD, PHONE_NUMBER) VALUES (?,?,?,?,?)"
            const [rows] = await connection.execute(sqlInsert, [names, surname, email, password1, phoneNumber]);

            const id = rows.insertId;
            sqlInsert = 'INSERT INTO ROLE_USER (ID_ROLE, ID_USER, ACTIVE) VALUES (?,?,?)'
            connection.execute(sqlInsert, [DRIVER_ROLE, id, ACTIVE]);
            connection.end();
            res.status(201).send(OK_MSG_API_POST_DRIVER);
        } catch (error) {
            console.log(`${ERROR_MSG_API_POST_DRIVER} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_POST_DRIVER} ${error}`);
        }

    }
    res.end();
};

const putDriver = async (req, res) => {
    const {id} = req.params
    const {names, surname, email, phoneNumber, password1, password2} = req.body;

    const inputsErrors = await validateDriversToModify(email, names, surname, password1, password2, phoneNumber, id);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlUptate = "UPDATE USER SET NAME= ?, SURNAME= ?, EMAIL= ?, PASSWORD= ?, PHONE_NUMBER= ? WHERE USER_ID = ?";
            const [rows] = await connection.execute(sqlUptate, [names, surname, email, password1, phoneNumber, id]);

            connection.end();
            res.status(200).send(OK_MSG_API_PUT_DRIVER);
        } catch (error) {
            console.log(`${ERROR_MSG_API_PUT_DRIVER} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_PUT_DRIVER} ${error}`);
        }
    }
    res.end();
};

const deleteDriver = async (req, res) => {
    const {id} = req.params;

    if (await validateDriverTransportDependence(id)) {
        res.status(400).send(`${ERROR_MSG_API_DELETE_DRIVER_TRANSPORT_DEPENDENCE}`);
    }/*// Analizar: creo que no es necesario agregar esta validación, ya que una cosa lleva a la otra
    else if (await validateDriverTripDependence(id)) {
        res.status(400).send("No se puede eliminar, el chofer figura como conductor de viajes");
    } */
    else {
        try {
            const connection = await prepareConnection();
            const sqlUptate = 'UPDATE ROLE_USER SET ACTIVE= ? WHERE ID_USER = ? AND ID_ROLE = ?';
            const [rows] = await connection.execute(sqlUptate, [NO_ACTIVE, id, DRIVER_ROLE]);
            connection.end();
            return res.status(200).send(OK_MSG_API_DELETE_DRIVER);
        } catch (error) {
            console.log(`${ERROR_MSG_API_DELETE_DRIVER} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_DELETE_DRIVER} ${error}`);
        }
    }
    res.end();
};

module.exports = {
    getDrivers,
    getDriverById,
    getAvailableDrivers,
    postDriver,
    putDriver,
    deleteDriver
}
