const {prepareConnection} = require("./connectionDB.js");

const {
    ERROR_MSG_API_TRIP_DATE_OVERLAP,
    ERROR_MSG_API_TRIP_VALIDATE_DATE_OVERLAP,
} = require('../const/messages.js');

let departureDayError;

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
            AND t.TRIP_ID = ${tripId}
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

module.exports = {
    validateTripToCreate,
    validateTripToUpdate
};
