const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRIPS,
    OK_MSG_API_FINISH_TRIP,
    ERROR_MSG_API_FINISH_TRIP,
    OK_MSG_API_PUT_TRIP_PASSENGER_TICKET_RISKY
} = require("../const/messages");

const {
    PASSENGER_ROLE,
    ACTIVE
} = require('../const/config.js');

const {normalizeTrips} = require("../helpers/normalizeResult");

const {
    validatePassengerEmailBirthdayToSellTrip,
    validateUserExistence,
    validateUserRiskiness,
    validateUserGoldCondition
} = require("../helpers/validateUserInputs.js");

const getDriverPendingTrips = async (req, res) => {
    const {id} = req.params;
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
                        SELECT DISTINCT
                        TRIP_ID, CONCAT('$', REPLACE(TR.PRICE, '.', ',')) PRICE, TR.PRICE NUMBERPRICE, TR.DEPARTURE_DAY,
                        DATE_FORMAT(TR.DEPARTURE_DAY, '%Y-%m-%d %H:%i') DEPARTURE_DAY, R.DURATION,
                        DATE_FORMAT(ADDTIME(TR.DEPARTURE_DAY, R.DURATION), '%Y-%m-%d %H:%i') ARRIVAL_DAY,
                        CI.CITY_ID DEPARTURE_ID, CONCAT(CI.CITY_NAME, ', ', PI.PROVINCE_NAME) DEPARTURE, 
                        CV.CITY_ID DESTINATION_ID, CONCAT(CV.CITY_NAME, ', ', PV.PROVINCE_NAME) DESTINATION,
                        T.TRANSPORT_ID, T.INTERNAL_IDENTIFICATION, T.REGISTRATION_NUMBER,
                        (CASE WHEN 
                          (T.SEATING - ( SELECT SUM(TI2.QUANTITY)
                              FROM TICKET TI2
                              INNER JOIN TRIP TR2 ON TI2.ID_TRIP = TR2.TRIP_ID
                              WHERE TI2.ID_STATUS_TICKET = 1 AND TR.TRIP_ID = TR2.TRIP_ID))
                          IS NULL
                          THEN T.SEATING
                          ELSE 
                          (T.SEATING - ( SELECT SUM(TI2.QUANTITY)
                              FROM TICKET TI2
                              INNER JOIN TRIP TR2 ON TI2.ID_TRIP = TR2.TRIP_ID
                              WHERE TI2.ID_STATUS_TICKET = 1 AND TR.TRIP_ID = TR2.TRIP_ID))
                          END) AS AVAILABLESEATINGS
                        FROM USER U 
                        INNER JOIN ROLE_USER RU ON U.USER_ID = RU.ROLE_USER_ID
                        INNER JOIN TRANSPORT T ON U.USER_ID = T.ID_DRIVER
                        INNER JOIN ROUTE R ON T.TRANSPORT_ID = R.ID_TRANSPORT
                        INNER JOIN TRIP TR ON TR.ID_ROUTE = R.ROUTE_ID
                        INNER JOIN CITY CI ON R.ID_DEPARTURE = CI.CITY_ID
                        INNER JOIN PROVINCE PI ON CI.ID_PROVINCE = PI.PROVINCE_ID
                        INNER JOIN CITY CV ON R.ID_DESTINATION = CV.CITY_ID
                        INNER JOIN PROVINCE PV ON CV.ID_PROVINCE = PV.PROVINCE_ID 
                        WHERE U.USER_ID = ${id}
                        AND TR.ACTIVE = 1
                        AND TR.ID_STATUS_TRIP = 1
                        ORDER BY TR.DEPARTURE_DAY ASC;`;
        const [rows] = await connection.execute(sqlSelect);
        connection.end();
        const normalizedResults = normalizeTrips(rows);
        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
    }
    res.end();
};

const getDriverFinishedTrips = async (req, res) => {
    const {id} = req.params;
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
                        SELECT DISTINCT
                        TRIP_ID, CONCAT('$', REPLACE(TR.PRICE, '.', ',')) PRICE, TR.PRICE NUMBERPRICE, TR.DEPARTURE_DAY,
                        DATE_FORMAT(TR.DEPARTURE_DAY, '%Y-%m-%d %H:%i') DEPARTURE_DAY, R.DURATION,
                        DATE_FORMAT(ADDTIME(TR.DEPARTURE_DAY, R.DURATION), '%Y-%m-%d %H:%i') ARRIVAL_DAY,
                        CI.CITY_ID DEPARTURE_ID, CONCAT(CI.CITY_NAME, ', ', PI.PROVINCE_NAME) DEPARTURE, 
                        CV.CITY_ID DESTINATION_ID, CONCAT(CV.CITY_NAME, ', ', PV.PROVINCE_NAME) DESTINATION,
                        T.TRANSPORT_ID, T.INTERNAL_IDENTIFICATION, T.REGISTRATION_NUMBER
                        FROM USER U 
                        INNER JOIN ROLE_USER RU ON U.USER_ID = RU.ROLE_USER_ID
                        INNER JOIN TRANSPORT T ON U.USER_ID = T.ID_DRIVER
                        INNER JOIN ROUTE R ON T.TRANSPORT_ID = R.ID_TRANSPORT
                        INNER JOIN TRIP TR ON TR.ID_ROUTE = R.ROUTE_ID
                        INNER JOIN CITY CI ON R.ID_DEPARTURE = CI.CITY_ID
                        INNER JOIN PROVINCE PI ON CI.ID_PROVINCE = PI.PROVINCE_ID
                        INNER JOIN CITY CV ON R.ID_DESTINATION = CV.CITY_ID
                        INNER JOIN PROVINCE PV ON CV.ID_PROVINCE = PV.PROVINCE_ID 
                        WHERE U.USER_ID = ${id}
                        AND TR.ACTIVE = 1
                        AND TR.ID_STATUS_TRIP = 3
                        ORDER BY TR.DEPARTURE_DAY ASC;`;
        const [rows] = await connection.execute(sqlSelect);
        connection.end();
        const normalizedResults = normalizeTrips(rows);
        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
    }
    res.end();
};

const finishTrip = async (req, res) => {
    const {id} = req.params;
    try {
        const connection = await prepareConnection();

        let sqlUpdate = `
                        UPDATE TICKET SET 
                        ID_STATUS_TICKET = 5
                        WHERE ID_TRIP IN 
                        (SELECT * FROM 
                          (
                            SELECT ID_TRIP FROM TICKET WHERE ID_TRIP = ${id}
                            AND ID_STATUS_TICKET = 2
                          ) tmpTable
                        );
                        `;

        await connection.execute(sqlUpdate);

        sqlUpdate = `UPDATE TRIP SET ID_STATUS_TRIP = 3 WHERE TRIP_ID = ${id};`;

        await connection.execute(sqlUpdate);

        connection.end();

        return res.status(200).send(OK_MSG_API_FINISH_TRIP);
    } catch (error) {
        console.log(`${ERROR_MSG_API_FINISH_TRIP} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_FINISH_TRIP} ${error}`);
    }
    res.end();
};

const cancelTrip = async (req, res) => {
    const {id} = req.params;
    try {
        const connection = await prepareConnection();

        let sqlSafeMode = `SET SQL_SAFE_UPDATES = 0;`;

        await connection.execute(sqlSafeMode);

        let sqlSelect = `
                        UPDATE TICKET SET ID_STATUS_TICKET = 4, 
                        ID_REFUND_PERCENTAGE = 1 
                        WHERE ID_TRIP IN 
                        (SELECT * FROM 
                          (
                          SELECT ID_TRIP FROM TICKET WHERE ID_TRIP = ${id}
                          AND ID_STATUS_TICKET IN (1, 2)
                          ) tmpTable
                        );
                        `;

        await connection.execute(sqlSelect);

        let sqlUpdate = `UPDATE TRIP SET ID_STATUS_TRIP = 2 WHERE TRIP_ID = ${id};`;

        await connection.execute(sqlUpdate);

        sqlSafeMode = `SET SQL_SAFE_UPDATES = 1;`;

        await connection.execute(sqlSafeMode);

        connection.end();

        return res.status(200).send('Se ha cancelado el viaje correctamente');
    } catch (error) {
        console.log(`Ocurrió un error al cancelar el viaje: ${error}`);
        res.status(500).send(`Ocurrió un error al cancelar el viaje: ${error}`);
    }
    res.end();
};

const validatePassengers = async (id) => {
    try {
        const connection = await prepareConnection();

        let sqlSelect =
            `
            SELECT * 
            FROM TRIP tri
            INNER JOIN TICKET tic ON tri.TRIP_ID = tic.ID_TRIP
            WHERE tri.TRIP_ID = ${id} 
            AND tic.ID_STATUS_TICKET = 1;
            `;

        let [rows] = await connection.execute(sqlSelect);
        connection.end();
        return rows.length >= 1;
    } catch (error) {
        console.log("Ocurrió un error al verificar los pasajeros pendientes", error);
        return false;
    }
};

const emptyList = async (id) => {
    try {
        const connection = await prepareConnection();
        let sqlSelect = `SELECT * FROM TRIP INNER JOIN TICKET ON TRIP.TRIP_ID=TICKET.ID_TRIP WHERE TRIP_ID = ${id};`;

        let [rows] = await connection.execute(sqlSelect);

        connection.end();
        return rows.length === 0;
    } catch (error) {
        console.log("Ocurrió un error al verificar los pasajeros pendientes", error);
        return false;
    }
};

// Validate inputs format and account (if exists, if is risky, if is gold)
const validateAccountToSellTrip = async (req, res) => {
    const {email, birthday} = req.body;

    let userInformation = {
        id: "",
        isGold: ""
    }

    const inputsErrors = validatePassengerEmailBirthdayToSellTrip(email, birthday);
    // The inputs are wrong
    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const userId = await validateUserExistence(email);
            //The user not exists
            if (!userId) {
                const connection = await prepareConnection();
                sqlInsert =
                    ` INSERT INTO USER (NAME, SURNAME, BIRTHDAY, EMAIL, PASSWORD, DATE_TERMS_CONDITIONS, GOLD_MEMBERSHIP_EXPIRATION) 
            VALUES ('Anonimo', 'Anonimo', '${birthday}', '${email}', '123456', NULL, NULL);
          `
                const [rows] = await connection.execute(sqlInsert);

                const id = rows.insertId;

                sqlInsert = `INSERT INTO ROLE_USER (ID_ROLE, ID_USER, ACTIVE) VALUES (${PASSENGER_ROLE}, ${id}, ${ACTIVE});`
                connection.execute(sqlInsert);

                userInformation.id = id;
                userInformation.isGold = false;

                res.status(201).json(userInformation)
            } else {
                const isRiskyUser = await validateUserRiskiness(email);
                // The user exists and is risky
                if (isRiskyUser) {
                    res.status(401).send(OK_MSG_API_PUT_TRIP_PASSENGER_TICKET_RISKY);
                }
                //The user exists and is not risky
                else {
                    const isGold = await validateUserGoldCondition(email);

                    userInformation.id = userId;
                    userInformation.isGold = isGold;

                    res.status(200).json(userInformation)
                }
            }
        } catch (error) {
            console.log(`Ocurrió un error al verificar el usuario para vender pasaje: ${error}`);
            res.status(500).send(`Ocurrió un error al verificar el usuario para vender pasaje`);
        }
    }
    res.end();
}


const getPassangerStatus = async (req, res) => {
    const {id} = req.params;
    try {
        res.json({
            passengersNotConfirmed: await validatePassengers(id)
        });
    } catch (error) {
        console.log(`Ocurrió un error al verificar los pasajeros pendientes: ${error}`);
        res.status(500).send(`Ocurrió un error al verificar los pasajeros pendientes`);
    }
    res.end();
};

module.exports = {
    getPassangerStatus,
    getDriverPendingTrips,
    getDriverFinishedTrips,
    finishTrip,
    cancelTrip,
    validateAccountToSellTrip
};
