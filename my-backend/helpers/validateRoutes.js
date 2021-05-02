const { prepareConnection } = require("./connectionDB.js");

const {
    REGEX_DURATION,
    REGEX_ONLY_NUMBER } = require('../const/regex.js');

const {
    ERROR_MSG_EMPTY_KM,
    ERROR_MSG_EMPTY_DURATION,
    ERROR_MSG_EMPTY_TRANSPORT,
    ERROR_MSG_EMPTY_PLACE_DESTINATION,
    ERROR_MSG_EMPTY_PLACE_DEPARTURE,
    ERROR_MSG_INVALID_KM,
    ERROR_MSG_INVALID_DURATION,
    ERROR_MSG_INVALID_TRANSPORT,
    ERROR_MSG_INVALID_PLACE_DESTINATION,
    ERROR_MSG_INVALID_PLACE_DEPARTURE,
    ERROR_MSG_REPEAT_PLACES,
    ERROR_MSG_EXISTING_PLACES
} = require('../const/messages.js');

let placeDepertureError;
let placeDestinationError;
let placesError;
let transportError;
let durationError;
let kmError;

const validateRoutesToCreate = async (idPlaceDeparture, idPlaceDestination, idTransport, duration, km) => {
    return (await validateRoutes(idPlaceDeparture, idPlaceDestination, idTransport, duration, km) && await validatePlacesToCreate(idPlaceDeparture, idPlaceDestination)) ? null : prepareRoutesResponse();
}

const validateRoutesToModify = async (idPlaceDeparture, idPlaceDestination, idTransport, duration, km, id) => {
    return (await validateRoutes(idPlaceDeparture, idPlaceDestination, idTransport, duration, km) && await validatePlacesToModify(idPlaceDeparture, idPlaceDestination, id)) ? null : prepareRoutesResponse();
}

const validateRoutes = async (idPlaceDeparture, idPlaceDestination, idTransport, duration, km) => {
    placesError = null;
    return ((await validatePlaceDeperture(idPlaceDeparture) & await validatePlaceDestination(idPlaceDestination) & await validateTransport(idTransport) & validateDuration(duration) & validateKm(km)) && comparePlaces(idPlaceDeparture,idPlaceDestination));
}

const prepareRoutesResponse = () => {
    return {
        placeDepertureError,
        placeDestinationError,
        placesError,
        transportError,
        durationError,
        kmError
    }
}

const checkPlaceInDb = async (idPlace) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM CITY WHERE CITY_ID = ?';;
        const [rows] = await connection.execute(sqlSelect, [idPlace]);
        connection.end();

        return rows.length >= 1;
    } catch (error) {
        console.log("Ha ocurrido un error al comprobar el lugar", error);
        return false;
    }
}

const checkRoutePlacesInDbToCreate = async (idPlaceDeparture, idPlaceDestination) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM ROUTE WHERE ID_DEPARTURE = ? AND ID_DESTINATION = ?';
        const [rows] = await connection.execute(sqlSelect, [idPlaceDeparture, idPlaceDestination]);
        connection.end();
        return rows.length >= 1;
    } catch (error) {
        console.log("Ha ocurrido un error al comprobar las dependencias de la ruta", error);
        return false;
    }
}

const checkRoutePlacesInDbToModify = async (idPlaceDeparture, idPlaceDestination, id) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM ROUTE WHERE ID_DEPARTURE = ? AND ID_DESTINATION = ? AND ROUTE_ID <> ?';
        const [rows] = await connection.execute(sqlSelect, [idPlaceDeparture, idPlaceDestination, id]);
        connection.end();
        return rows.length >= 1;
    } catch (error) {
        console.log("Ha ocurrido un error al comprobar las dependencias de la ruta", error);
        return false;
    }
}

const checkTransportInDb = async (idTransport) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM TRANSPORT WHERE TRANSPORT_ID = ?';;
        const [rows] = await connection.execute(sqlSelect, [idTransport]);
        connection.end();

        return rows.length >= 1;
    } catch (error) {
        console.log("Ha ocurrido un error al comprobar el lugar", error);
        return false;
    }
}

const validatePlaceDeperture = async (idPlace) => {
    if (!idPlace) {
        placeDepertureError = ERROR_MSG_EMPTY_PLACE_DEPARTURE;
        return false;
    }
    else if (!await checkPlaceInDb(idPlace)) {
        placeDepertureError = ERROR_MSG_INVALID_PLACE_DEPARTURE;
        return false;
    }

    placeDepertureError = null;
    return true;
}

const validatePlaceDestination = async (idPlace) => {
    if (!idPlace) {
        placeDestinationError = ERROR_MSG_EMPTY_PLACE_DESTINATION;
        return false;
    }
    else if (!await checkPlaceInDb(idPlace)) {
        placeDestinationError = ERROR_MSG_INVALID_PLACE_DESTINATION;
        return false;
    }

    placeDestinationError = null;
    return true;
}

const comparePlaces = (idPlaceDeparture, idPlaceDestination) => {
    console.log(idPlaceDeparture);
    console.log(idPlaceDestination);
    if (idPlaceDeparture === idPlaceDestination) {
        placesError = ERROR_MSG_REPEAT_PLACES;
        return false;
    }
    return true;
}

const validatePlacesToCreate = async (idPlaceDeparture, idPlaceDestination) => {
    if (await checkRoutePlacesInDbToCreate(idPlaceDeparture, idPlaceDestination)) {
        placesError = ERROR_MSG_EXISTING_PLACES;
        return false;
    }
    placesError = null;
    return true;
}

const validatePlacesToModify = async (idPlaceDeparture, idPlaceDestination, id) => {
    if (await checkRoutePlacesInDbToModify(idPlaceDeparture, idPlaceDestination, id)) {
        placesError = ERROR_MSG_EXISTING_PLACES;
        return false;
    }
    placesError = null;
    return true;
}

const validateTransport = async (idTransport) => {
    if (!idTransport) {
        transportError = ERROR_MSG_EMPTY_TRANSPORT;
        return false;
    }
    else if (REGEX_ONLY_NUMBER.test(idTransport)) {
        transportError = ERROR_MSG_INVALID_TRANSPORT;
        return false;
    }
    else if (!await checkTransportInDb(idTransport)) {
        transportError = ERROR_MSG_INVALID_TRANSPORT;
        return false;
    }
    transportError = null;
    return true;
}

const validateDuration = (duration) => {
    if (!duration) {
        durationError = ERROR_MSG_EMPTY_DURATION;
        return false;
    }
    else if (REGEX_DURATION.test(duration)) {
        durationError = ERROR_MSG_INVALID_DURATION;
        return false;
    }
    durationError = null;
    return true;
}

const validateKm = (km) => {
    if (!km) {
        kmError = ERROR_MSG_EMPTY_KM;
        return false;
    }
    else if (REGEX_ONLY_NUMBER.test(km)) {
        kmError = ERROR_MSG_INVALID_KM;
        return false;
    }
    kmError = null;
    return true;
}

module.exports = {
    validateRoutesToCreate,
    validateRoutesToModify
}