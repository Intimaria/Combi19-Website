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
    ERROR_MSG_API_TRIP_VALIDATE_TICKET_DEPENDENCE,
    ERROR_MSG_API_SEARCH_TRIPS
} = require("../const/messages");

const {
    ACTIVE
} = require("../const/config")

const {normalizeTrips} = require("../helpers/normalizeResult");

const {
    validateTripToCreate,
    validateTripToUpdate,
    validateDataToSearch
} = require("../helpers/validateTripInputs");

const getTrips = async (req, res) => {
    //const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();

        let sqlMode = `SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`;

        await connection.execute(sqlMode);

        let sqlSelect =
                `
                SELECT 
                tri.TRIP_ID, REPLACE(tri.PRICE, '.', ',') PRICE, tri.ACTIVE, r.ROUTE_ID,
                DATE_FORMAT(tri.DEPARTURE_DAY, '%Y-%m-%d %H:%i') DEPARTURE_DAY, 
                tri.DEPARTURE_DAY DEPARTURE_DAY_ORIGINAL,
                c1.CITY_ID DEPARTURE_ID, CONCAT(c1.CITY_NAME, ', ', p1.PROVINCE_NAME) DEPARTURE, 
                c2.CITY_ID DESTINATION_ID, CONCAT(c2.CITY_NAME, ', ', p2.PROVINCE_NAME) DESTINATION,
                DATE_FORMAT(ADDTIME(tri.DEPARTURE_DAY, r.DURATION), '%Y-%m-%d %H:%i') ARRIVAL_DAY,
                ADDTIME(tri.DEPARTURE_DAY, r.DURATION) ARRIVAL_DAY_ORIGINAL,
                tra.TRANSPORT_ID, tra.INTERNAL_IDENTIFICATION, tra.REGISTRATION_NUMBER, 
                CONCAT(u.SURNAME, ', ', u.NAME) DRIVER,
                ti.ID_STATUS_TICKET,
                (CASE WHEN MIN(ti.ID_STATUS_TICKET) = 1 THEN "Pendiente"
                       WHEN MIN(ti.ID_STATUS_TICKET) = 2 THEN "En viaje"
                      WHEN MAX(ti.ID_STATUS_TICKET) = 5 THEN "Finalizado"
                      WHEN (ti.ID_STATUS_TICKET = 3 or ti.ID_STATUS_TICKET = 4) and tri.DEPARTURE_DAY > NOW() THEN 'Pendiente'
                      WHEN (ti.ID_STATUS_TICKET = 3 or ti.ID_STATUS_TICKET = 4) and (tri.DEPARTURE_DAY <= NOW() and ADDTIME(tri.DEPARTURE_DAY, r.DURATION) > NOW()) THEN 'Activo'
                      WHEN (ti.ID_STATUS_TICKET = 3 or ti.ID_STATUS_TICKET = 4) and ADDTIME(tri.DEPARTURE_DAY, r.DURATION) < NOW() THEN 'Finalizado'
                      WHEN (ti.ID_STATUS_TICKET IS NULL) and (ADDTIME(tri.DEPARTURE_DAY, r.DURATION) < NOW()) THEN 'Finalizado'
                      ELSE "-"        
                END) AS STATUS
                FROM TRIP tri
                INNER JOIN ROUTE r ON tri.ID_ROUTE = r.ROUTE_ID
                INNER JOIN CITY c1 ON r.ID_DEPARTURE = c1.CITY_ID
                INNER JOIN PROVINCE p1 ON c1.ID_PROVINCE = p1.PROVINCE_ID
                INNER JOIN CITY c2 ON r.ID_DESTINATION = c2.CITY_ID
                INNER JOIN PROVINCE p2 ON c2.ID_PROVINCE = p2.PROVINCE_ID
                INNER JOIN TRANSPORT tra ON r.ID_TRANSPORT = tra.TRANSPORT_ID
                LEFT JOIN TICKET ti ON ti.ID_TRIP = tri.TRIP_ID
                INNER JOIN USER u ON u.USER_ID=tra.ID_DRIVER
                GROUP BY tri.TRIP_ID, tri.PRICE, tri.ACTIVE, tri.DEPARTURE_DAY, r.ROUTE_ID,
                tra.TRANSPORT_ID, tra.INTERNAL_IDENTIFICATION, tra.REGISTRATION_NUMBER,
                ti.ID_STATUS_TICKET, c1.CITY_ID, c2.CITY_ID, c2.CITY_NAME, c1.CITY_NAME, 
                p2.PROVINCE_NAME, p1.PROVINCE_NAME, r.DURATION, u.SURNAME, u.NAME
                ORDER BY tri.DEPARTURE_DAY ASC
            `;

        const [rows] = await connection.execute(sqlSelect);

        sqlMode = `SET GLOBAL sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';`;

        await connection.execute(sqlMode);

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
        console.log('Ocurrió un error al obtener al viaje indicado: ', error);
        res.status(500);
    }
    res.end();
};

const getTripDependenceById = async (req, res) => {
    const {id} = req.params;

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

            const [rows] = await connection.execute(sqlInsert);
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

const searchTrip = async (req, res) => {
    const {departure, destination, departureDate} = req.body;
    const inputsErrors = await validateDataToSearch(departure, destination, departureDate);
    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlSelect =
            `
            SELECT tri1.TRIP_ID AS tripId,
            tri1.PRICE AS price,
            tri1.ID_ROUTE AS routeId,
            (CASE WHEN 
                (tra.SEATING - ( SELECT SUM(t.QUANTITY)
                    FROM TICKET t
                    INNER JOIN TRIP tri2 ON t.ID_TRIP = tri2.TRIP_ID
                    WHERE t.ID_STATUS_TICKET = 1 AND tri1.TRIP_ID = tri2.TRIP_ID))
                IS NULL
                THEN tra.SEATING
                ELSE 
                (tra.SEATING - ( SELECT SUM(t.QUANTITY)
                    FROM TICKET t
                    INNER JOIN TRIP tri2 ON t.ID_TRIP = tri2.TRIP_ID
                    WHERE t.ID_STATUS_TICKET = 1 AND tri1.TRIP_ID = tri2.TRIP_ID))
                END) AS availableSeatings,
            tra.REGISTRATION_NUMBER AS registrationNumber,
            CONCAT(depci.CITY_NAME, ', ', depp.PROVINCE_NAME) departure,
            CONCAT(desci.CITY_NAME, ', ', desp.PROVINCE_NAME) destination,
            DATE_FORMAT(tri1.DEPARTURE_DAY, '%Y-%m-%d %H:%i') AS departureDay FROM 
            TRIP tri1 INNER JOIN 
            ROUTE r ON (tri1.ID_ROUTE=r.ROUTE_ID) INNER JOIN
            TRANSPORT tra ON (tra.TRANSPORT_ID=r.ID_TRANSPORT) INNER JOIN
            CITY depci ON (r.ID_DEPARTURE=depci.CITY_ID) INNER JOIN
            PROVINCE depp ON (depci.ID_PROVINCE=depp.PROVINCE_ID) INNER JOIN
            CITY desci ON (r.ID_DESTINATION=desci.CITY_ID) INNER JOIN
            PROVINCE desp ON (desci.ID_PROVINCE=desp.PROVINCE_ID)
            WHERE 
            tri1.ACTIVE = ${ACTIVE} AND
            depci.CITY_ID = ${departure}  AND
            desci.CITY_ID = ${destination} AND
            (CAST(tri1.DEPARTURE_DAY as DATE)) = "${departureDate}"
            AND tri1.DEPARTURE_DAY >= NOW();
          `;

            const [rows] = await connection.execute(sqlSelect);

            connection.end();
            res.status(200).send(rows.filter(trip => trip.availableSeatings > 0));
        } catch (error) {
            console.log(`${ERROR_MSG_API_SEARCH_TRIPS} ${error}`);
            res.status(500);
        }
    }
    res.end();
}
module.exports = {
    getTrips,
    getTripById,
    getTripDependenceById,
    postTrip,
    putTrip,
    deleteTrip,
    searchTrip
}
