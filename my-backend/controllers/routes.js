const { prepareConnection } = require("../helpers/connectionDB.js");

const { validateRoutesToCreate, validateRoutesToModify } = require("../helpers/validateRoutes.js");

const {
    ACTIVE,
    NO_ACTIVE } = require("../const/config.js");

    const getRoutes = async (req, res) => {
        const connection = await prepareConnection();
        connection.query("SELECT c.CITY_NAME, p.PROVINCE_NAME FROM CITY as c INNER JOIN PROVINCE as p ON (c.ID_PROVINCE = p.PROVINCE_ID) ORDER BY c.CITY_NAME ASC, p.PROVINCE_NAME ASC", []).then((result) => {
            connection.end();
            res.status(200).send(result[0]);
        }).catch(function (err) {
            console.log('Ha ocurrido un error al obtener los lugares: ', err);
            res.status(500);
        });
        res.end();
    }

    const getRouteById = async (req, res) => {
        const {id} = req.params;
        const connection = await prepareConnection();
        connection.query("SELECT c.CITY_NAME, p.PROVINCE_NAME FROM CITY as c INNER JOIN PROVINCE as p ON (c.ID_PROVINCE = p.PROVINCE_ID) WHERE c.CITY_ID=?", [id]).then((result) => {
            connection.end();
            res.status(200).send(result[0]);
        }).catch(function (err) {
            console.log('Ha ocurrido un error al obtener al lugar indicado: ', err);
            res.status(500);
        });
        res.end();
    }
    const deleteRoute = async (req, res) => {
        const {id} = req.params;
        const {id_province} = req.body;
        // validate place exists? validate place exists else return error code.
        if (await validatePlaceDependency(id)) {
            res.status(400).send("No se puede eliminar, el lugar figura entre rutas o viajes existentes.");
        }
        const connection = await prepareConnection();
        connection.query('UPDATE CITY SET ACTIVE= ? WHERE CITY_ID = ? AND ID_PROVINCE = ?', [NO_ACTIVE, id, id_province]).then((place) => {
            connection.end();
            res.status(200).send('Se ha eliminado el lugar con éxito');
        }).catch(function (err) {
            console.log('Ha ocurrido un error al eliminar el lugar indicado: ', err);
            res.status(500);
        });
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




module.exports = {
    getRoutes,
    getRouteById,
    postRoute,
    putRoute,
    deleteRoute
}
