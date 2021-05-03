const {prepareConnection} = require("../helpers/connectionDB.js");

const {OK_MSG_TRANSPORT_CREATED} = require("../const/messages");

const {normalizeTransport} = require("../helpers/normalizeResult")

const getTransports = async (req, res) => {
    const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();

        let sqlSelect =
            `
            SELECT t.TRANSPORT_ID, t.INTERNAL_IDENTIFICATION, t.MODEL, t.REGISTRATION_NUMBER, t.SEATING, t.ACTIVE,
            tc.TYPE_COMFORT_ID, tc.NAME TYPE_COMFORT_NAME, u.*            
            FROM TRANSPORT t
            INNER JOIN TYPE_COMFORT tc ON t.ID_TYPE_COMFORT = tc.TYPE_COMFORT_ID
            INNER JOIN USER u ON t.ID_DRIVER = u.USER_ID
            ORDER BY TRANSPORT_ID ASC LIMIT ${start - 1}, ${limit};
            `;
        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        const normalizedResults = await normalizeTransport(rows);

        res.json(normalizedResults);

    } catch (e) {
        console.log('Ocurrió un error al obtener las combis:', e)
    }
}

const getTransportById = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();

        let sqlSelect = `
            SELECT t.TRANSPORT_ID, t.INTERNAL_IDENTIFICATION, t.MODEL, t.REGISTRATION_NUMBER, t.SEATING, t.ACTIVE,
            tc.TYPE_COMFORT_ID, tc.NAME TYPE_COMFORT_NAME, u.*            
            FROM TRANSPORT t
            INNER JOIN TYPE_COMFORT tc ON t.ID_TYPE_COMFORT = tc.TYPE_COMFORT_ID
            INNER JOIN USER u ON t.ID_DRIVER = u.USER_ID
            WHERE TRANSPORT_ID = ${id}`;
        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        const normalizedResults = await normalizeTransport(rows);

        res.json(normalizedResults);
    } catch (e) {
        console.log('Ocurrió un error al obtener la combi:', e)
    }
}

const postTransport = async (req, res) => {
    const {internal_identification, model, registration_number, seating, id_type_comfort, id_driver} = req.body;

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

        res.status(201).send(OK_MSG_TRANSPORT_CREATED);
    } catch (e) {
        console.log("Ocurrió un error al crear la combi:", e);
    }
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
