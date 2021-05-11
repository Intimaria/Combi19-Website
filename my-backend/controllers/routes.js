
const { prepareConnection } = require("../helpers/connectionDB.js");

const { validateRoutesToCreate, validateRoutesToModify, validateRouteTripsDependence } = require("../helpers/validateRoutes.js");

const {normalizeRoutes} = require('../helpers/normalizeResult.js');

const {
    ERROR_MSG_API_ROUTES,
    ERROR_MSG_API_DELETE_ROUTE,
    OK_MSG_API_DELETE_ROUTE,
    ERROR_MSG_API_DELETE_ROUTE_TRIP_DEPENDENCE
    
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

        const sqlSelect = `
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
        INNER JOIN PROVINCE p1 on (c1.ID_PROVINCE=p1.PROVINCE_ID) ORDER BY r.KM ASC`;
        const [rows] = await connection.execute(sqlSelect, []);
        connection.end();
        const normalizedResults = normalizeRoutes(rows);
        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_ROUTES}: ${error}`);
        res.status(500).send(`${ERROR_MSG_API_ROUTES}: ${error}`);
    }
    res.end();
};


    const getRouteById = async (req, res) => {
    }

    const deleteRoute = async (req, res) => {
            const {id} = req.params;
     
            if (await validateRouteTripsDependence(id)) {
                res.status(400).send(`${ERROR_MSG_API_DELETE_ROUTE_TRIP_DEPENDENCE}`);
            } else {

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
            }
            res.end();
        
    }

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
            res.status(201).send("Se ha registrado el ruta con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al crear el ruta: ', error);
            res.status(500);
        }
    }
    res.end();
}

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
            res.status(200).send("Se ha actualizado los datos del ruta con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al actualizar los datos del ruta: ', error);
            res.status(500);
        }
    }
    res.end();
}




module.exports = {
    getRoutes,
    getRouteById,
    postRoute,
    putRoute,
    deleteRoute
}
