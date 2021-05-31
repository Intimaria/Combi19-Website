
const { prepareConnection } = require("../helpers/connectionDB.js");

const { validateRoutesToCreate, validateRoutesToModify, validateRouteTripsDependence } = require("../helpers/validateRoutes.js");

const { normalizeRoutes } = require('../helpers/normalizeResult.js');

const {
    ERROR_MSG_API_GET_ROUTE,
    ERROR_MSG_API_POST_ROUTE,
    ERROR_MSG_API_PUT_ROUTE,
    ERROR_MSG_API_DELETE_ROUTE,
    OK_MSG_API_DELETE_ROUTE,
    ERROR_MSG_API_ROUTE_VALIDATE_TRIP_DEPENDENCE,
    ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE
} = require('../const/messages.js');

const {
    ACTIVE,
    NO_ACTIVE } = require("../const/config.js");


const getRoutes = async (req, res) => {
    try {
        const connection = await prepareConnection();
        /*
        concat(cast(substring(DURATION, 1, 2) AS UNSIGNED), IF(substring(DURATION, 1, 2) = "01", ' hora y ', ' horas y ') , substring(DURATION, 4, 2) , ' minutos') as DURATION
         */

        const sqlSelect =
                `
                SELECT r.ROUTE_ID, 
                substring(DURATION, 1, 5) as DURATION, 
                r.KM, t.INTERNAL_IDENTIFICATION, t.TRANSPORT_ID, r.ACTIVE,
                c.CITY_NAME as Departure_City_Name, p.PROVINCE_NAME as Departure_Province_Name, c.CITY_ID as Departure_City_Id,
                c1.CITY_NAME as Destination_City_Name, p1.PROVINCE_NAME as Destination_Province_Name, c1.CITY_ID as Destination_City_Id
                FROM TRANSPORT t
                INNER JOIN ROUTE r ON (r.ID_TRANSPORT=t.TRANSPORT_ID) 
                INNER JOIN CITY c on (r.id_departure=c.city_id) 
                INNER JOIN CITY c1 on (r.id_destination=c1.city_id) 
                INNER JOIN PROVINCE p on (c.ID_PROVINCE=p.PROVINCE_ID) 
                INNER JOIN PROVINCE p1 on (c1.ID_PROVINCE=p1.PROVINCE_ID) 
                ORDER BY c.CITY_NAME, p.PROVINCE_NAME, c1.CITY_NAME, p1.PROVINCE_NAME ASC;
                `;

        const [rows] = await connection.execute(sqlSelect, []);

        connection.end();

        const normalizedResults = normalizeRoutes(rows);

        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_ROUTE}: ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_ROUTE}: ${error}`);
    }
    res.end();
};


const getRouteById = async (req, res) => {
};

const getAvailableRoutes = async (req, res) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect =
            `
            SELECT r.ROUTE_ID routeId, CONCAT(t.INTERNAL_IDENTIFICATION, ' - ', t.REGISTRATION_NUMBER) transport,
            c1.CITY_ID departureId, CONCAT(c1.CITY_NAME, ', ', p1.PROVINCE_NAME) departure,
            c2.CITY_ID destinationId, CONCAT(c2.CITY_NAME, ', ', p2.PROVINCE_NAME) destination
            FROM ROUTE r
            INNER JOIN TRANSPORT t ON r.ID_TRANSPORT = t.TRANSPORT_ID
            INNER JOIN CITY c1 ON r.ID_DEPARTURE = c1.CITY_ID
            INNER JOIN PROVINCE p1 ON c1.ID_PROVINCE = p1.PROVINCE_ID
            INNER JOIN CITY c2 ON r.ID_DESTINATION = c2.CITY_ID
            INNER JOIN PROVINCE p2 ON c2.ID_PROVINCE = p2.PROVINCE_ID
            WHERE r.ACTIVE = ${ACTIVE}
            ORDER BY DEPARTURE ASC, DESTINATION ASC;
            `;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        return res.status(200).send(rows);

    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE} ${error}`);
    }
    res.end();
};

const deleteRoute = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await prepareConnection();
        const sqlUpdate =
            'UPDATE ROUTE SET ACTIVE = 0 WHERE ROUTE_ID = ?';
        const [rows] = await connection.execute(sqlUpdate, [id]);
        connection.end();
        return res.status(200).send(OK_MSG_API_DELETE_ROUTE);
    } catch (error) {
        console.log(`${ERROR_MSG_API_DELETE_ROUTE} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_DELETE_ROUTE} ${error}`);
    }
    res.end();

};

const postRoute = async (req, res) => {
    const { idPlaceDeparture, idPlaceDestination, idTransport, duration, km } = req.body;
    const inputsErrors = await validateRoutesToCreate(idPlaceDeparture, idPlaceDestination, idTransport, duration, km);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            const sqlInsert = "INSERT INTO ROUTE (ID_DEPARTURE, ID_DESTINATION, ID_TRANSPORT, DURATION, KM, ACTIVE) VALUES (?,?,?,?,?,?)";
            const [rows] = await connection.execute(sqlInsert, [idPlaceDeparture, idPlaceDestination, idTransport, duration, km, ACTIVE]);
            connection.end();
            res.status(201).send("Se creó la ruta con éxito");
        } catch (error) {
            console.log(ERROR_MSG_API_POST_ROUTE, error);
            res.status(500).send(`${ERROR_MSG_API_POST_ROUTE} ${error}`);
        }
    }
    res.end();
};

const putRoute = async (req, res) => {
    const { id } = req.params;

    const { idPlaceDeparture, idPlaceDestination, idTransport, duration, km } = req.body;
    const inputsErrors = await validateRoutesToModify(idPlaceDeparture, idPlaceDestination, idTransport, duration, km, id);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlUptate = "UPDATE ROUTE SET ID_DEPARTURE=?, ID_DESTINATION=?, ID_TRANSPORT=?, DURATION=?, KM=? WHERE ROUTE_ID = ?";
            const [rows] = await connection.execute(sqlUptate, [idPlaceDeparture, idPlaceDestination, idTransport, duration, km, id]);

            connection.end();
            res.status(200).send("Se actualizaron los datos de la ruta con éxito");
        } catch (error) {
            console.log(ERROR_MSG_API_PUT_ROUTE, error);
            res.status(500).send(`${ERROR_MSG_API_PUT_ROUTE} ${error}`);
        }
    }
    res.end();
};

const getRouteDependenceById = async (req, res) => {
    const { id } = req.params;
    try {
        res.json({
            routeTripDependence: validateRouteTripsDependence(id)
        });
    } catch (error) {
        console.log(`${ERROR_MSG_API_ROUTE_VALIDATE_TRIP_DEPENDENCE} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_ROUTE_VALIDATE_TRIP_DEPENDENCE}`);
    }
    res.end();
};

module.exports = {
    getRoutes,
    getRouteById,
    postRoute,
    putRoute,
    deleteRoute,
    getRouteDependenceById,
    getAvailableRoutes
};
