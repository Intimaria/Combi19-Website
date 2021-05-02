const {prepareConnection} = require("../helpers/connectionDB.js");
const {validateDrivers} = require("../helpers/validateUserInputs.js");
const {validateDriverTransportDependence} = require('../helpers/validateDriverDependences.js');
const {DRIVER_ROLE, NO_ACTIVE, ACTIVE} = require('../const_back/config.js');
// const { validateDriverTripDependence } = require('../helpers/validateDriverDependences.js');

const getDrivers = async (req, res) => {
    const {start = 1, limit = 5} = req.query;
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL, ACTIVE FROM user a INNER JOIN role_user r ON (a.USER_ID = r.ID_USER) WHERE r.ID_ROLE = ? ORDER BY SURNAME ASC, NAME ASC LIMIT ?, ?';
        const [rows] = await connection.execute(sqlSelect, [DRIVER_ROLE, start - 1, limit]);
        connection.end();
        return res.status(200).send(rows);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener los datos de todos los choferes: ', error);
        res.status(500);
    }
}

const getDriverById = async (req, res) => {
    try {
        const {id} = req.params;
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL, PASSWORD, PHONE_NUMBER, ACTIVE FROM user a INNER JOIN role_user r ON (a.USER_ID = r.ID_USER) WHERE r.ID_ROLE = ? AND a.USER_ID = ?';
        const [rows, fields] = await connection.execute(sqlSelect, [DRIVER_ROLE, id]);
        connection.end();
        return res.status(200).send(rows[0]);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener al chofer indicado: ', error);
        res.status(500);
    }

}

const postDriver = async (req, res) => {
    const {names, surname, email, phoneNumber, password1, password2} = req.body;

    const inputsErrors = await validateDrivers(email, names, surname, password1, password2, phoneNumber);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlInsert = "INSERT INTO user(NAME, SURNAME, EMAIL, PASSWORD,PHONE_NUMBER) VALUES (?,?,?,?,?)"
            const [rows] = await connection.execute(sqlInsert, [names, surname, email, password1, phoneNumber]);

            const id = rows.insertId;
            sqlInsert = 'INSERT INTO role_user (ID_ROLE, ID_USER, ACTIVE) VALUES (?,?,?)'
            connection.execute(sqlInsert, [DRIVER_ROLE, id, ACTIVE]);
            connection.end();
            res.status(201).send("Se ha registrado el chofer con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al crear el chofer: ', error);
            res.status(500);
        }

    }
    ;
}

const putDriver = async (req, res) => {
    const {id} = req.params
    const {names, surname, email, phoneNumber, password1, password2} = req.body;

    const inputsErrors = await validateDrivers(email, names, surname, password1, password2, phoneNumber);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlUptate = "UPDATE user SET NAME= ?, SURNAME= ?, EMAIL= ?, PASSWORD= ?, PHONE_NUMBER= ? WHERE USER_ID = ?";
            const [rows] = await connection.execute(sqlUptate, [names, surname, email, password1, phoneNumber, id]);

            connection.end();
            res.status(201).send("Se ha actualizado los datos del chofer con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al actualizar los datos del chofer: ', error);
            res.status(500);
        }
    }
    ;
}

const deleteDriver = async (req, res) => {
    const {id} = req.params;

    if (await validateDriverTransportDependence(id)) {
        res.status(400).send("No se puede eliminar, el chofer figura como conductor de combis");
    }/*
    else if (await validateDriverTripDependence(id)) {
        res.status(400).send("No se puede eliminar, el chofer figura como conductor de viajes");
    } */
    else {
        try {
            const connection = await prepareConnection();
            const sqlUptate = 'UPDATE role_user SET ACTIVE= ? WHERE ID_USER = ?';
            const [rows] = await connection.execute(sqlUptate, [NO_ACTIVE, id]);
            connection.end();
            return res.status(200).send('Se ha eliminado el chofer con éxito');
        } catch (error) {
            console.log('Ha ocurrido un error al eliminar el chofer indicado: ', error);
            res.status(500);
        }
    }
}

module.exports = {
    getDrivers,
    getDriverById,
    postDriver,
    putDriver,
    deleteDriver
}
