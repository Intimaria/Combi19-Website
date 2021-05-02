const { prepareConnection } = require("../helpers/connectionDB.js");

const { validateRoutesToCreate, validateRoutesToModify } = require("../helpers/validateRoutes.js");

const {
    ACTIVE,
    NO_ACTIVE } = require("../const/config.js");

const getRoutes = async (req, res) => {
    const { start = 1, limit = 5 } = req.query;

    try {
        const connection = await prepareConnection();
        /*
        Continue with the code
         */
        connection.end();
        return res.status(200).send(rows);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener los datos de todos los rutas: ', error);
        res.status(500);
    }
    res.end();
}

const getRouteById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await prepareConnection();
        /*
        Continue with the code
         */
        connection.end();
        return res.status(200).send(rows[0]);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener al ruta indicado: ', error);
        res.status(500);
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
            res.status(201).send("Se ha actualizado los datos del ruta con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al actualizar los datos del ruta: ', error);
            res.status(500);
        }
    }
    res.end();
}

const deleteRoute = async (req, res) => {
    const { id } = req.params;
    /*
    Continue with the code
     */
    res.end();
}

module.exports = {
    getRoutes,
    getRouteById,
    postRoute,
    putRoute,
    deleteRoute
}
