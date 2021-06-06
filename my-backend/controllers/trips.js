const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRIPS,
    OK_MSG_API_TRIP_POST,
    ERROR_MSG_API_POST_TRIP,
    ERROR_MSG_API_TRIP_DATE_OVERLAP,
    ERROR_MSG_API_TRIP_VALIDATE_DATE_OVERLAP,
    OK_MSG_API_PUT_TRIP,
    ERROR_MSG_API_PUT_TRIP,
    OK_MSG_API_DELETE_TRIP,
    ERROR_MSG_API_DELETE_TRIP,
    ERROR_MSG_API_TRIP_VALIDATE_TICKET_DEPENDENCE
} = require("../const/messages");

const {normalizeTrips} = require("../helpers/normalizeResult");

const {
    validateTripToCreate,
    validateTripToUpdate
} = require("../helpers/validateTripInputs");

const getTrips = async (req, res) => {
    //const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();

        let sqlSelect =
                `
            SELECT 
            tri.TRIP_ID, REPLACE(tri.PRICE, '.', ',') PRICE, tri.ACTIVE,
            DATE_FORMAT(tri.DEPARTURE_DAY, '%Y-%m-%d %H:%i') DEPARTURE_DAY, r.ROUTE_ID,
            c1.CITY_ID DEPARTURE_ID, CONCAT(c1.CITY_NAME, ', ', p1.PROVINCE_NAME) DEPARTURE, 
            c2.CITY_ID DESTINATION_ID, CONCAT(c2.CITY_NAME, ', ', p2.PROVINCE_NAME) DESTINATION,
            CONCAT(DATE_FORMAT(ADDTIME(tri.DEPARTURE_DAY, r.DURATION), '%d/%m/%Y %H:%i'), 'hs') ARRIVAL_DAY,
            tra.TRANSPORT_ID, tra.INTERNAL_IDENTIFICATION, tra.REGISTRATION_NUMBER
            FROM TRIP tri
            INNER JOIN ROUTE r ON tri.ID_ROUTE = r.ROUTE_ID
            INNER JOIN CITY c1 ON r.ID_DEPARTURE = c1.CITY_ID
            INNER JOIN PROVINCE p1 ON c1.ID_PROVINCE = p1.PROVINCE_ID
            INNER JOIN CITY c2 ON r.ID_DESTINATION = c2.CITY_ID
            INNER JOIN PROVINCE p2 ON c2.ID_PROVINCE = p2.PROVINCE_ID
            INNER JOIN TRANSPORT tra ON r.ID_TRANSPORT = tra.TRANSPORT_ID
            ORDER BY tri.DEPARTURE_DAY ASC, ARRIVAL_DAY ASC, DEPARTURE ASC, DESTINATION ASC;
            `;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        const normalizeResults = normalizeTrips(rows);

        return res.status(200).send(normalizeResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
    }
    res.end();
};

const getTripById = async (req, res) => {
    try {
        const {id} = req.params;
        const connection = await prepareConnection();
        /*
        Continue with the code
         */
        connection.end();
        return res.status(200).send(rows[0]);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener al viaje indicado: ', error);
        res.status(500);
    }
    res.end();
};

const getTripDependenceById = async (req, res) => {
    const {id} = req.params;

    console.log('getTripDependenceById backend, id es:', id);

    try {
        const connection = await prepareConnection();

        let sqlSelect =
            `
            SELECT
            tri.TRIP_ID, tic.TICKET_ID, tic.ID_STATUS_TICKET
            FROM TRIP tri
            INNER JOIN TICKET tic ON tri.TRIP_ID = tic.ID_TRIP
            INNER JOIN CART c ON tic.ID_CART = c.CART_ID
            WHERE tri.TRIP_ID = ${id}
            AND c.DATE IS NOT NULL
            AND tic.ID_STATUS_TICKET <> 3;
            `;

        const [rows] = await connection.execute(sqlSelect);

        console.log('rows es:');
        console.log(rows);

        connection.end();

        res.json({
            tripTicketDependence: rows.length >= 1
        });
    } catch (error) {
        console.log(`${ERROR_MSG_API_TRIP_VALIDATE_TICKET_DEPENDENCE} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_TRIP_VALIDATE_TICKET_DEPENDENCE} ${error}`);
    }
    res.end();
};

const postTrip = async (req, res) => {
    const {routeId, price, departureDay} = req.body;

    console.log('idRoute, price, departureDay es', routeId, price, departureDay);

    const inputsErrors = await validateTripToCreate(routeId, departureDay);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();

            let sqlInsert =
                `
                INSERT INTO TRIP
                (ID_ROUTE, PRICE, DEPARTURE_DAY, ACTIVE)
                VALUES (${routeId}, ${price}, '${departureDay}', 1);
                `;

            await connection.execute(sqlInsert);

            connection.end();
            res.status(201).send(OK_MSG_API_TRIP_POST);
        } catch (error) {
            console.log(`${ERROR_MSG_API_POST_TRIP} ${error}`);
            res.status(500).send(`${ERROR_MSG_API_POST_TRIP} ${error}`);
        }

    }
    res.end();
};

const putTrip = async (req, res) => {
    const {id} = req.params;

    const {routeId, price, departureDay} = req.body;

    console.log('id, routeId, price, departureDay', id, routeId, price, departureDay)

    const inputsErrors = await validateTripToUpdate(routeId, departureDay, id);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();

            let sqlUpdate =
                `
                UPDATE TRIP 
                SET ID_ROUTE = ${routeId}, 
                PRICE = ${price}, 
                DEPARTURE_DAY = '${departureDay}'
                WHERE TRIP_ID = ${id};
              `;

            const [rows] = await connection.execute(sqlUpdate);

            connection.end();
            res.status(200).send(OK_MSG_API_PUT_TRIP);
        } catch (error) {
            console.log(`${ERROR_MSG_API_PUT_TRIP} ${error}`);
            res.status(500);
        }
    }
    res.end();
};

const deleteTrip = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();

        const sqlUpdate =
            `
            UPDATE TRIP SET ACTIVE = 0 
            WHERE TRIP_ID = ${id};
            `;

        const [rows] = await connection.execute(sqlUpdate);

        connection.end();

        return res.status(200).send(OK_MSG_API_DELETE_TRIP);
    } catch (error) {
        console.log(`${ERROR_MSG_API_DELETE_TRIP} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_DELETE_TRIP} ${error}`);
    }

    res.end();
};

module.exports = {
    getTrips,
    getTripById,
    getTripDependenceById,
    postTrip,
    putTrip,
    deleteTrip
}
