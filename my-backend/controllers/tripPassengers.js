const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRIP_PASSENGERS,
    OK_MSG_API_PUT_TRIP_PASSENGER_TICKET_ABSENT,
    ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET
} = require("../const/messages");

const getPassengersByTrip = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();

        let sqlSelect =
            `
            SELECT tri.TRIP_ID tripId, u.USER_ID passengerId, u.NAME passengerName, 
            u.SURNAME passengerSurname, u.EMAIL passengerEmail, 
            tic.TICKET_ID ticketId, st.STATUS ticketStatus
            FROM TRIP tri
            INNER JOIN TICKET tic ON tri.TRIP_ID = tic.ID_TRIP
            INNER JOIN STATUS_TICKET st ON tic.ID_STATUS_TICKET = st.STATUS_TICKET_ID
            INNER JOIN CART c ON tic.ID_CART = c.CART_ID
            INNER JOIN USER u ON c.ID_USER = u.USER_ID
            WHERE tri.TRIP_ID = ${id}
            ORDER BY tri.TRIP_ID, u.NAME ASC, u.SURNAME ASC;
            `;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();


        return res.status(200).send(rows);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRIP_PASSENGERS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_TRIP_PASSENGERS} ${error}`);
    }
    res.end();
};

const absentPassengersByTrip = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();

        let sqlUpdate =
            `
            UPDATE TICKET SET ID_STATUS_TICKET = 4
            WHERE ID_TRIP = ${id}
            AND ID_STATUS_TICKET = 1;
            `;

        await connection.execute(sqlUpdate);

        connection.end();

        return res.status(200).send(OK_MSG_API_PUT_TRIP_PASSENGER_TICKET_ABSENT);
    } catch (error) {
        console.log(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${error}`);
    }
    res.end();
};

module.exports = {
    getPassengersByTrip,
    absentPassengersByTrip
};
