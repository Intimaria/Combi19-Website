require('dotenv').config();

const {
    ERROR_MSG_API_GET_PLACES,
    ERROR_MSG_API_GET_ACTIVE_PLACES,
    ERROR_MSG_API_GET_PLACE_BY_ID,
    OK_MSG_API_PLACE_POST,
    ERROR_MSG_API_POST_PLACE,
    ERROR_MSG_API_PLACE_EXISTING_PLACE,
    OK_MSG_API_PLACE_PUT,
    ERROR_MSG_API_PUT_PLACE,
    OK_MSG_API_DELETE_PLACE,
    ERROR_MSG_API_DELETE_PLACE,    
    ERROR_MSG_API_MODIFY_PLACE_ROUTE_DEPENDENCE,
    ERROR_MSG_API_DELETE_PLACE_ROUTE_DEPENDENCE,
    ERROR_MSG_API_PLACE_DEPENDENCE
} = require('../const/messages.js');

const {prepareConnection} = require("../helpers/connectionDB.js");

//const { validatePlace } = require('../helpers/validateInputsPlaces.js');

const {
    validatePlaceDependency,
    validatePlaceExists,
    validatePlaceExistsForDelete,
    validatePlaceToUpdate
} = require('../helpers/validatePlaceDependency.js');

const {normalizePlaces} = require('../helpers/normalizeResult.js');

const {NO_ACTIVE, ACTIVE} = require('../const/config.js');


const getProvinces = async (req, res) => {
    const connection = await prepareConnection();
    await connection.query("SELECT PROVINCE_NAME FROM PROVINCE", []).then((result) => {
        connection.end();
        res.status(200).send(result[0]);
    }).catch(function (err) {
        console.log('Ha ocurrido un error al obtener las provincias: ', err);
        res.status(500);
    });
    res.end();
}


const getPlaces = async (req, res) => {
    const connection = await prepareConnection();
    await connection.query("SELECT c.CITY_ID, c.CITY_NAME, c.ACTIVE, c.ID_PROVINCE, p.PROVINCE_NAME FROM CITY as c INNER JOIN PROVINCE as p ON (c.ID_PROVINCE = p.PROVINCE_ID) ORDER BY c.CITY_NAME ASC, p.PROVINCE_NAME ASC", []).then((result) => {
        connection.end();
        const normalizeResults = normalizePlaces(result[0]);
        res.status(200).send(normalizeResults);
    }).catch(function (error) {
        console.log(`${ERROR_MSG_API_GET_PLACES} ${error}`);
        res.status(500);
    });
    res.end();
}

const getActivePlaces = async (req, res) => {
    const connection = await prepareConnection();
    await connection.query("SELECT c.CITY_ID, c.CITY_NAME, c.ACTIVE, c.ID_PROVINCE, p.PROVINCE_NAME FROM CITY as c INNER JOIN PROVINCE as p ON (c.ID_PROVINCE = p.PROVINCE_ID) WHERE ACTIVE = ? ORDER BY c.CITY_NAME ASC, p.PROVINCE_NAME ASC", [ACTIVE]).then((result) => {
        connection.end();
        const normalizeResults = normalizePlaces(result[0]);
        res.status(200).send(normalizeResults);
    }).catch(function (error) {
        console.log(`${ERROR_MSG_API_GET_ACTIVE_PLACES} ${error}`);
        res.status(500);
    });
    res.end();
}


const getPlaceById = async (req, res) => {
    const {id} = req.params;
    const connection = await prepareConnection();
    await connection.query("SELECT c.CITY_NAME, p.PROVINCE_NAME FROM CITY as c INNER JOIN PROVINCE as p ON (c.ID_PROVINCE = p.PROVINCE_ID) WHERE c.CITY_ID=?", [id]).then((result) => {
        connection.end();
        res.status(200).send(result[0]);
    }).catch(function (error) {
        console.log(`${ERROR_MSG_API_GET_PLACE_BY_ID} ${error}`);
        res.status(500);
    });
    res.end();
}

const putPlace = async (req, res) => {
    const {cityName, idProvince} = req.body;

    const {id} = req.params;
    console.log(req.body, id);

    
    if (await validatePlaceDependency(id)) {
        res.status(400).send(ERROR_MSG_API_MODIFY_PLACE_ROUTE_DEPENDENCE);
    }
    //const inputsErrors = await validatePlace(city, province);
    else if (await validatePlaceToUpdate(cityName, idProvince, id)) {
        res.status(409).send("* La ciudad ya existe para esta provincia");
    } else {
        const connection = await prepareConnection();
        await connection.query(
            "UPDATE CITY SET CITY_NAME=?, ID_PROVINCE=? WHERE CITY_ID = ?",
            [cityName, idProvince, id]).then((result) => {
            connection.end();

            console.log(result[0], cityName, ':)')

            res.status(200).send(OK_MSG_API_PLACE_PUT);
        }).catch(function (error) {
            console.log(`${ERROR_MSG_API_PUT_PLACE} ${error}`);
            res.status(500);
        });
    }
    res.end();
}

const postPlace = async (req, res) => {
    const {cityName, idProvince} = req.body;
    //const inputsErrors = await validatePlace(city, province);
    if (await validatePlaceExists(cityName, idProvince)) {
        res.status(400).send(ERROR_MSG_API_PLACE_EXISTING_PLACE);
    } else {
        const connection = await prepareConnection();
        await connection.query(
            "INSERT INTO CITY (ID_PROVINCE, CITY_NAME, ACTIVE) VALUES (?,?,?)",
            [idProvince, cityName, ACTIVE]).then((result) => {
            connection.end();
            res.status(201).send(OK_MSG_API_PLACE_POST);
        }).catch(function (error) {
            console.log(`${ERROR_MSG_API_POST_PLACE} ${error}`);
            res.status(500);
        })
    }
    res.end();
}


const deletePlace = async (req, res) => {
    const {id} = req.params;
    //const {idProvince} = req.body;
    //console.log(req.body, id, idProvince);
    // validate place exists? validate place exists else return error code.

    if (await validatePlaceDependency(id)) {
        res.status(400).send(ERROR_MSG_API_DELETE_PLACE_ROUTE_DEPENDENCE);
    }
    /*
    else 
    if (! await validatePlaceExistsForDelete (id, idProvince)) {
        res.status(404).send("No se puede eliminar, el lugar no existe.");
    }
    */
    else {
 
        const connection = await prepareConnection();
        await connection.query('UPDATE CITY SET ACTIVE= ? WHERE CITY_ID = ?' /* AND ID_PROVINCE = ?'*/, [NO_ACTIVE, id, /*idProvince*/]).then((place) => {
            connection.end();
            res.status(200).send(OK_MSG_API_DELETE_PLACE);
        }).catch(function (error) {
            console.log(`${ERROR_MSG_API_DELETE_PLACE} ${error}`);
            res.status(500);
        });
  //  }
    res.end();
    }
}  

const getPlaceDependenceById = async (req, res) => {
    const { id } = req.params;
    try {
        res.json({
            placeDependence: validatePlaceDependency(id)
        });
        console.log(res);
    } catch (error) {
        console.log(`${ERROR_MSG_API_PLACE_DEPENDENCE} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_PLACE_DEPENDENCE}`);
    }
    res.end();
};

module.exports = {
    getProvinces,
    getPlaces,
    getActivePlaces,
    postPlace,
    getPlaceById,
    putPlace,
    deletePlace,
    getPlaceDependenceById
}
