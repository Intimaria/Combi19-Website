require('dotenv').config();

const {
    OK_MSG_API_LOCATION_POST,
    OK_MSG_API_LOCATION_PUT
} = require('../const/messages.js');

const {prepareConnection} = require("../helpers/connectionDB.js");

//const { validatePlace } = require('../helpers/validateInputsPlaces.js');

const {validatePlaceDependency, validatePlaceExists, validatePlaceExistsForDelete, validatePlaceToUpdate} = require('../helpers/validatePlaceDependency.js');

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
    }).catch(function (err) {
        console.log('Ha ocurrido un error al obtener los lugares: ', err);
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
    }).catch(function (err) {
        console.log('Ha ocurrido un error al obtener al lugar indicado: ', err);
        res.status(500);
    });
    res.end();
}

const putPlace = async (req, res) => {
    const {cityName, idProvince} = req.body;

    const {id} = req.params;
    console.log(req.body, id);
    //const inputsErrors = await validatePlace(city, province);
    if (await validatePlaceToUpdate(cityName, idProvince, id)) {
        res.status(400).send("* La ciudad ya existe para esta provincia");
    } else {
        const connection = await prepareConnection();
        await connection.query(
            "UPDATE CITY SET CITY_NAME=?, ID_PROVINCE=? WHERE CITY_ID = ?",
            [cityName, idProvince, id]).then((result) => {
            connection.end();

            console.log(result[0], cityName, ':)')

            res.status(200).send(OK_MSG_API_LOCATION_PUT);
        }).catch(function (error) {
            console.log('Ha ocurrido un error al modificar al lugar indicado: ', error);
            res.status(500);
        });
    }
    res.end();
}

const postPlace = async (req, res) => {
    const {cityName, idProvince} = req.body;
    //const inputsErrors = await validatePlace(city, province);
    if (await validatePlaceExists(cityName, idProvince)) {
        res.status(400).send("* La ciudad ya existe para esta provincia");
    } else {
        const connection = await prepareConnection();
        await connection.query(
            "INSERT INTO CITY (ID_PROVINCE, CITY_NAME, ACTIVE) VALUES (?,?,?)",
            [idProvince, cityName, ACTIVE]).then((result) => {
            connection.end();
            res.status(201).send(OK_MSG_API_LOCATION_POST);
        }).catch(function (err) {
            console.log('Ha ocurrido un error al crear la ciudad: ', err);
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
        res.status(400).send("No se puede eliminar, el lugar figura entre rutas existentes.");
    }/*
    else if (! await validatePlaceExistsForDelete (id, idProvince)) {
        res.status(404).send("No se puede eliminar, el lugar no existe.");
    }*/
    else {
        const connection = await prepareConnection();
        await connection.query('UPDATE CITY SET ACTIVE= ? WHERE CITY_ID = ?' /* AND ID_PROVINCE = ?'*/, [NO_ACTIVE, id, /*idProvince*/]).then((place) => {
            connection.end();
            res.status(200).send('Se ha eliminado el lugar con éxito');
        }).catch(function (error) {
            console.log('Ha ocurrido un error al eliminar el lugar indicado: ', error);
            res.status(500);
        });
    }
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
