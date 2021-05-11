const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRANSPORTS,
    ERROR_MSG_API_GET_ACTIVE_TRANSPORTS,
    ERROR_MSG_API_GET_TRANSPORT_BY_ID,
    OK_MSG_API_TRANSPORT_POST,
    ERROR_MSG_API_POST_TRANSPORT,
    OK_MSG_API_PUT_TRANSPORT,
    ERROR_MSG_API_PUT_TRANSPORT,
    OK_MSG_API_DELETE_TRANSPORT,
    ERROR_MSG_API_DELETE_TRANSPORT,
    ERROR_MSG_API_DELETE_TRANSPORT_ROUTE_DEPENDENCE
} = require("../const/messages");

const {
    ACTIVE,
    NO_ACTIVE
} = require('../const/config.js');

const {
    validateTransportToCreate,
    validateTransportToUpdate
} = require("../helpers/validateTransportInputs");

const {validateTransportRouteDependence} = require("../helpers/validateTransportDependences");


const {normalizeTransport} = require("../helpers/normalizeResult");

const getTransports = async (req, res) => {
    //const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();

        let sqlSelect =
                `
            SELECT t.TRANSPORT_ID, t.INTERNAL_IDENTIFICATION, t.MODEL, t.REGISTRATION_NUMBER, t.SEATING, t.ACTIVE,
            tc.TYPE_COMFORT_ID, tc.TYPE_COMFORT_NAME, u.*            
            FROM TRANSPORT t
            INNER JOIN TYPE_COMFORT tc ON t.ID_TYPE_COMFORT = tc.TYPE_COMFORT_ID
            INNER JOIN USER u ON t.ID_DRIVER = u.USER_ID
            ORDER BY TRANSPORT_ID ASC;
            `;
        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        const normalizedResults = normalizeTransport(rows);

        res.json(normalizedResults);

    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`);
    }
    res.end();
};

const getActiveTransports = async (req, res) => {
    //const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();

        let sqlSelect =
            `
            SELECT t.TRANSPORT_ID, t.INTERNAL_IDENTIFICATION, t.MODEL, t.REGISTRATION_NUMBER, t.SEATING, t.ACTIVE,
            tc.TYPE_COMFORT_ID, tc.TYPE_COMFORT_NAME, u.*            
            FROM TRANSPORT t
            INNER JOIN TYPE_COMFORT tc ON t.ID_TYPE_COMFORT = tc.TYPE_COMFORT_ID
            INNER JOIN USER u ON t.ID_DRIVER = u.USER_ID
            WHERE ACTIVE = ${ACTIVE}
            ORDER BY TRANSPORT_ID ASC;
            `;
        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        const normalizedResults = normalizeTransport(rows);

        res.json(normalizedResults);

    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_ACTIVE_TRANSPORTS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_ACTIVE_TRANSPORTS} ${error}`);
    }
    res.end();
};

const getTransportById = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();

        let sqlSelect = `
            SELECT t.TRANSPORT_ID, t.INTERNAL_IDENTIFICATION, t.MODEL, t.REGISTRATION_NUMBER, t.SEATING, t.ACTIVE,
            tc.TYPE_COMFORT_ID, tc.TYPE_COMFORT_NAME, u.*            
            FROM TRANSPORT t
            INNER JOIN TYPE_COMFORT tc ON t.ID_TYPE_COMFORT = tc.TYPE_COMFORT_ID
            INNER JOIN USER u ON t.ID_DRIVER = u.USER_ID
            WHERE TRANSPORT_ID = ${id};`;
        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        const normalizedResults = await normalizeTransport(rows);

        res.json(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRANSPORT_BY_ID} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_TRANSPORT_BY_ID} ${error}`);
    }
    res.end();
};

const postTransport = async (req, res) => {
    const {internal_identification, model, registration_number, seating, id_type_comfort, id_driver} = req.body;

    const inputsErrors = await validateTransportToCreate(internal_identification, registration_number);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();

            let sqlInsert =
                `
                INSERT INTO TRANSPORT
                (INTERNAL_IDENTIFICATION, MODEL, REGISTRATION_NUMBER, SEATING, ID_TYPE_COMFORT, ID_DRIVER, ACTIVE)
                VALUES ('${internal_identification}', '${model}', '${registration_number}', ${seating}, ${id_type_comfort}, ${id_driver}, 1);
                `;

            await connection.execute(sqlInsert);

            connection.end();

            res.status(201).send(OK_MSG_API_TRANSPORT_POST);
        } catch (error) {
            console.log(`${ERROR_MSG_API_POST_TRANSPORT} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_POST_TRANSPORT} ${error}`);
        }
    }
    res.end();
};

const putTransport = async (req, res) => {

    const {id} = req.params;

    const {internal_identification, model, registration_number, seating, id_type_comfort, id_driver} = req.body;

    const inputsErrors = await validateTransportToUpdate(internal_identification, registration_number, id);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();

            let sqlUpdate =
                `
                UPDATE TRANSPORT 
                SET INTERNAL_IDENTIFICATION = '${internal_identification}', 
                MODEL = '${model}', 
                REGISTRATION_NUMBER = '${registration_number}', 
                SEATING = ${seating}, 
                ID_TYPE_COMFORT = ${id_type_comfort}, 
                ID_DRIVER = ${id_driver}
                WHERE TRANSPORT_ID = ${id};
              `;

            const [rows] = await connection.execute(sqlUpdate);

            connection.end();
            res.status(200).send(OK_MSG_API_PUT_TRANSPORT);
        } catch (error) {
            console.log(`${ERROR_MSG_API_PUT_TRANSPORT} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_PUT_TRANSPORT} ${error}`);
        }
    }
    res.end();
};

const deleteTransport = async (req, res) => {
    const {id} = req.params;

    if (await validateTransportRouteDependence(id)) {
        res.status(400).send(`${ERROR_MSG_API_DELETE_TRANSPORT_ROUTE_DEPENDENCE}`);
    } else {
        try {
            const connection = await prepareConnection();
            const sqlUptate =
                `
            UPDATE TRANSPORT SET ACTIVE = 0 
            WHERE TRANSPORT_ID = ${id};
            `;

            const [rows] = await connection.execute(sqlUptate);
            connection.end();

            return res.status(200).send(OK_MSG_API_DELETE_TRANSPORT);
        } catch (error) {
            console.log(`${ERROR_MSG_API_DELETE_TRANSPORT} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_DELETE_TRANSPORT} ${error}`);
        }
    }
    res.end();
};

module.exports = {
    getTransports,
    getActiveTransports,
    getTransportById,
    postTransport,
    putTransport,
    deleteTransport
};
