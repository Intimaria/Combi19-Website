const { prepareConnection } = require("./connectionDB.js");

const {
    ERROR_MSG_API_TRIP_DATE_OVERLAP,
    ERROR_MSG_API_TRIP_VALIDATE_DATE_OVERLAP,
    ERROR_MSG_EMPTY_DATE,
    ERROR_MSG_INVALID_DATE,
    ERROR_MSG_EMPTY_PLACE_DESTINATION,
    ERROR_MSG_EMPTY_PLACE_DEPARTURE,
    ERROR_MSG_INVALID_PLACE_DESTINATION,
    ERROR_MSG_INVALID_PLACE_DEPARTURE,
    ERROR_MSG_REPEAT_PLACES
} = require('../const/messages.js');

const {
    REGEX_ONLY_NUMBER,
    REGEX_DATE_YYYY_MM_DD
} = require('../const/regex.js');

let departureDayError;

let departureError;
let destinationError;
let departureDateToSearchError;
let repeatPlaceError;

const validateTripToCreate = async (routeId, departureDay) => {
    let isDepartureDayValid = await verifyDepartureDayOverlapToCreate(routeId, departureDay);
    if (isDepartureDayValid) departureDayError = null;

    if (isDepartureDayValid) {
        return null;
    } else {
        return prepareTripResponse()
    }
};

const validateTripToUpdate = async (routeId, departureDay, tripId) => {
    let isDepartureDayValid = await verifyDepartureDayOverlapToUpdate(routeId, departureDay, tripId);
    if (isDepartureDayValid) departureDayError = null;

    if (isDepartureDayValid) {
        return null;
    } else {
        return prepareTripResponse()
    }
};

const verifyDepartureDayOverlapToCreate = async (routeId, departureDay) => {
    try {

        const connection = await prepareConnection();

        const sqlSelect =
            `
            SELECT
            t.TRIP_ID, r.ROUTE_ID
            FROM TRIP t
            INNER JOIN ROUTE r ON t.ID_ROUTE = r.ROUTE_ID
            WHERE t.ACTIVE = 1
            AND r.ID_TRANSPORT = 
            (
              SELECT r2.ID_TRANSPORT
              FROM ROUTE r2
              WHERE r2.ROUTE_ID = ${routeId}
            )
			AND 
            ( 
				(t.DEPARTURE_DAY <= ADDTIME('${departureDay}', r.DURATION) AND ADDTIME(t.DEPARTURE_DAY, r.DURATION) >= ADDTIME('${departureDay}', r.DURATION)) 
				OR (t.DEPARTURE_DAY <= '${departureDay}' AND ADDTIME(t.DEPARTURE_DAY, r.DURATION) >= '${departureDay}')
            );
            `
            ;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        if (rows.length >= 1) {
            departureDayError = ERROR_MSG_API_TRIP_DATE_OVERLAP;
            return false;
        } else {
            departureDayError = null;
            return true;
        }

    } catch (error) {
        console.log(`${ERROR_MSG_API_TRIP_VALIDATE_DATE_OVERLAP}, error`);
    }
};

const verifyDepartureDayOverlapToUpdate = async (routeId, departureDay, tripId) => {
    try {

        const connection = await prepareConnection();

        const sqlSelect =
            `
            SELECT
            t.TRIP_ID, r.ROUTE_ID
            FROM TRIP t
            INNER JOIN ROUTE r ON t.ID_ROUTE = r.ROUTE_ID
            WHERE t.ACTIVE = 1
            AND t.TRIP_ID <> ${tripId}
            AND r.ID_TRANSPORT = 
            (
              SELECT r2.ID_TRANSPORT
              FROM ROUTE r2
              WHERE r2.ROUTE_ID = ${routeId}
            )
			AND 
            ( 
				(t.DEPARTURE_DAY <= ADDTIME('${departureDay}', r.DURATION) AND ADDTIME(t.DEPARTURE_DAY, r.DURATION) >= ADDTIME('${departureDay}', r.DURATION)) 
				OR (t.DEPARTURE_DAY <= '${departureDay}' AND ADDTIME(t.DEPARTURE_DAY, r.DURATION) >= '${departureDay}')
            );
            `
            ;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        if (rows.length >= 1) {
            departureDayError = ERROR_MSG_API_TRIP_DATE_OVERLAP;
            return false;
        } else {
            departureDayError = null;
            return true;
        }

    } catch (error) {
        console.log(`${ERROR_MSG_API_TRIP_VALIDATE_DATE_OVERLAP}, error`);
    }
};

const prepareTripResponse = () => {
    return {
        departureDayError,
    }
};

const validateDataToSearch = async (departure, destination, departureDateToSearch) => {
    return (((validateDeparture(departure) & validateDestination(destination)) && comparesPlaces(departure,destination)) & validateDepartureDateToSearch(departureDateToSearch)) ? null : searchErrorResponse();
}

const searchErrorResponse = () => {
    return {
        departureError,
        destinationError,
        departureDateToSearchError,
        repeatPlaceError
    }
}

const validateDeparture = (departure) => {
    if (!departure) {
        departureError = (ERROR_MSG_EMPTY_PLACE_DEPARTURE);
        return false;
    } else if (REGEX_ONLY_NUMBER.test(departure)) {
        departureError = (ERROR_MSG_INVALID_PLACE_DEPARTURE);
        return false;
    }

    departureError = null;
    return true;
}

const validateDestination = (destination) => {
    if (!destination) {
        destinationError = (ERROR_MSG_EMPTY_PLACE_DESTINATION);
        return false;
    } else if (REGEX_ONLY_NUMBER.test(destination)) {
        destinationError = (ERROR_MSG_INVALID_PLACE_DESTINATION);
        return false;
    }

    destinationError = null;
    return true;
}

const comparesPlaces = (departure, destination) => {
    if (departure === destination) {
        repeatPlaceError = (ERROR_MSG_REPEAT_PLACES);
        return false;
    }

    repeatPlaceError = (null);
    return true;
}

const validateDepartureDateToSearch = (dateFrom) => {
    if (!dateFrom) {
        departureDateToSearchError = (ERROR_MSG_EMPTY_DATE);
        return false;
    }

    if (!REGEX_DATE_YYYY_MM_DD.test(dateFrom)) {
        departureDateToSearchError = (ERROR_MSG_INVALID_DATE);
        return false;
    }

    const parts = dateFrom.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    if (new Date(year, month - 1, day) < (new Date(currentYear, currentMonth, currentDay)) || new Date(year, month - 1, day) > new Date(currentYear + 3, currentMonth, currentDay) || month === 0 || month > 12) {
        departureDateToSearchError = (ERROR_MSG_INVALID_DATE);
        return false;
    }
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;

    if (!(day > 0 && day <= monthLength[month - 1])) {
        departureDateToSearchError = (ERROR_MSG_INVALID_DATE);
        return false;
    }

    departureDateToSearchError = null;
    return true;
}

module.exports = {
    validateTripToCreate,
    validateTripToUpdate,
    validateDataToSearch
};
