const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRANSPORTS,
    ERROR_MSG_API_GET_TRANSPORT_BY_ID,
    OK_MSG_API_TRANSPORT_POST,
    ERROR_MSG_API_POST_TRANSPORT
} = require("../const/messages");

const {validateTransportToCreate} = require("../helpers/validateTransportInputs");

const {normalizeTransport} = require("../helpers/normalizeResult")

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

        const normalizedResults = await normalizeTransport(rows);

        res.json(normalizedResults);

    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRANSPORTS} ${error}`)
    }
    res.end();
}

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
            WHERE TRANSPORT_ID = ${id}`;
        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        const normalizedResults = await normalizeTransport(rows);

        res.json(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRANSPORT_BY_ID} ${error}`)
    }
    res.end();
}

const postTransport = async (req, res) => {
    const {internal_identification, model, registration_number, seating, id_type_comfort, id_driver} = req.body;

    console.log('Valores recibidos:', internal_identification, model, registration_number, seating, id_type_comfort, id_driver);

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
                `

            await connection.execute(sqlInsert);

            connection.end();

            res.status(201).send(OK_MSG_API_TRANSPORT_POST);
        } catch (error) {
            console.log(`${ERROR_MSG_API_POST_TRANSPORT} ${error}`);
            res.status(500);
        }
    }
    res.end();
};

const putTransport = async (req, rest) => {

}

const deleteTransport = async (req, rest) => {

}

module.exports = {
    getTransports,
    getTransportById,
    postTransport,
    putTransport,
    deleteTransport
}
