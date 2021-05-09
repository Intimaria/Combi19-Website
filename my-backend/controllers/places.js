require('dotenv').config();

const { OK_MSG_API_LOCATION_POST } = require('../const/messages.js');

const { prepareConnection } = require("../helpers/connectionDB.js");

//const { validatePlace } = require('../helpers/validateInputsPlaces.js');

const { validatePlaceDependency } = require('../helpers/validatePlaceDependency.js');

const { normalizePlaces } = require('../helpers/normalizeResult.js');

const { NO_ACTIVE, ACTIVE } = require('../const/config.js');


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
    await connection.query("SELECT c.CITY_ID, c.CITY_NAME, p.PROVINCE_NAME, c.ACTIVE FROM CITY as c INNER JOIN PROVINCE as p ON (c.ID_PROVINCE = p.PROVINCE_ID) ORDER BY c.CITY_NAME ASC, p.PROVINCE_NAME ASC", []).then((result) => {
        connection.end();
        const normalizeResults = normalizePlaces(result[0]);
        res.status(200).send(normalizeResults);
    }).catch(function (err) {
        console.log('Ha ocurrido un error al obtener los lugares: ', err);
        res.status(500);
    });
    res.end();
}


const getPlaceById = async (req, res) => {
    const { id } = req.params;
    const connection = await prepareConnection();
    await connection.query("SELECT c.CITY_NAME, p.PROVINCE_NAME FROM CITY as c INNER JOIN PROVINCE as p ON (c.ID_PROVINCE = p.PROVINCE_ID) WHERE c.CITY_ID=?", [id]).then((result) => {
        connection.end();
        res.status(200).send(result[0]);
    }).catch(function (err) {
        console.log('Ha ocurrido un error al obtener al lugar indicado: ', err);
        res.status(500);
    });
    res.end();
}

const putPlace = async (req, res) => {
    const { city_name, id_province } = req.body;
    console.log(req.body);
    const { id } = req.params;
    //const inputsErrors = await validatePlace(city, province);
    const connection = await prepareConnection();
    await connection.query(
        "UPDATE CITY SET CITY_NAME=?, ID_PROVINCE=?, ACTIVE=? WHERE CITY_ID = ?",
        [city_name, id_province, ACTIVE, id]).then((result) => {
            connection.end();
            res.status(201).send(result[0]);
        }).catch(function (err) {
            console.log('Ha ocurrido un error al modificar al lugar indicado: ', err);
            res.status(500);
        });
    res.end();
}

const postPlace = async (req, res) => {
    const { city_name, id_province } = req.body;
    //const inputsErrors = await validatePlace(city, province);
    const connection = await prepareConnection();
    await connection.query(
        "INSERT INTO CITY (ID_PROVINCE, CITY_NAME, ACTIVE) VALUES (?,?,?)",
        [id_province, city_name, ACTIVE]).then((result) => {
            connection.end();
            res.status(201).send(OK_MSG_API_LOCATION_POST);
        }).catch(function (err) {
            console.log('Ha ocurrido un error al crear la ciudad: ', err);
            res.status(500);
        })
    res.end();
}


const deletePlace = async (req, res) => {
    const { id } = req.params;
    const { id_province } = req.body;
    // validate place exists? validate place exists else return error code.
    if (await validatePlaceDependency(id)) {
        res.status(400).send("No se puede eliminar, el lugar figura entre rutas o viajes existentes.");
    }
    const connection = await prepareConnection();
    await connection.query('UPDATE CITY SET ACTIVE= ? WHERE CITY_ID = ? AND ID_PROVINCE = ?', [NO_ACTIVE, id, id_province]).then((place) => {
        connection.end();
        res.status(200).send('Se ha eliminado el lugar con éxito');
    }).catch(function (err) {
        console.log('Ha ocurrido un error al eliminar el lugar indicado: ', err);
        res.status(500);
    });
    res.end();
}


module.exports = {
    getProvinces,
    getPlaces,
    postPlace,
    getPlaceById,
    putPlace,
    deletePlace
}
