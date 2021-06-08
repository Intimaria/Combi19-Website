const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRIPS,
    OK_MSG_API_POST_PASSENGER_TRIP,
    ERROR_MSG_API_POST_PASSENGER_TRIP
} = require("../const/messages");

const {normalizeTrips} = require("../helpers/normalizeResult");

const getPassengerTrips = async (req, res) => {
    //const {start = 1, limit = 5} = req.query;
    const {id} = req.params;
    try {
        const connection = await prepareConnection();

        let sqlSelect =
            `
            SELECT 
            tri.TRIP_ID, FORMAT(tri.PRICE, 2, 'es_AR') PRICE, tri.ACTIVE,
            CONCAT(DATE_FORMAT(tri.DEPARTURE_DAY, '%d/%m/%Y %H:%i'), 'hs') DEPARTURE_DAY, 
            CONCAT(c1.CITY_NAME, ', ', p1.PROVINCE_NAME) DEPARTURE, 
            CONCAT(c2.CITY_NAME, ', ', p2.PROVINCE_NAME) DESTINATION,
            CONCAT(DATE_FORMAT(ADDTIME(tri.DEPARTURE_DAY, r.DURATION), '%d/%m/%Y %H:%i'), 'hs') ARRIVAL_DAY,
            tra.INTERNAL_IDENTIFICATION, tra.REGISTRATION_NUMBER
            FROM USER u
            INNER JOIN CART car ON car.ID_USER=u.USER_ID
            INNER JOIN TICKET tic ON tic.ID_CART=car.CART_ID
            INNER JOIN TRIP tri ON tri.TRIP_ID=tic.ID_TRIP
            INNER JOIN ROUTE r ON tri.ID_ROUTE = r.ROUTE_ID
            INNER JOIN CITY c1 ON r.ID_DEPARTURE = c1.CITY_ID
            INNER JOIN PROVINCE p1 ON c1.ID_PROVINCE = p1.PROVINCE_ID
            INNER JOIN CITY c2 ON r.ID_DESTINATION = c2.CITY_ID
            INNER JOIN PROVINCE p2 ON c2.ID_PROVINCE = p2.PROVINCE_ID
            INNER JOIN TRANSPORT tra ON r.ID_TRANSPORT = tra.TRANSPORT_ID
            WHERE tic.ID_STATUS_TICKET = 5 AND u.USER_ID = ${id}
            ORDER BY tri.DEPARTURE_DAY ASC, ARRIVAL_DAY ASC, DEPARTURE ASC, DESTINATION ASC;
            `;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        const normalizeResults = normalizeTrips(rows);

        return res.status(200).send(normalizeResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
    }
    res.end();
};


const postPassengerTrip = async (req, res) => {

    const {cart, cardId, userId} = req.body;

    try {
        const connection = await prepareConnection();

        let sqlInsert;

        sqlInsert =
            `
            INSERT INTO CART
            (ID_CARD,
            ID_USER,
            DATE)
            VALUES
            (${(cardId) ? cardId : NULL},
            ${userId},
            NOW());
            `;

        const [rows] = await connection.execute(sqlInsert);

        const cartId = rows.insertId;

        sqlInsert =
            `
            INSERT INTO TICKET
            (ID_CART,
            ID_TRIP,
            ID_STATUS_TICKET,
            QUANTITY,
            TICKET_PRICE)
            VALUES
            (${cartId},
            ${cart.tripId},
            ${1},
            ${cart.ticket.quantity},
            ${cart.ticket.price});
            `;

        await connection.execute(sqlInsert);

        for (let product of cart.products) {
            sqlInsert =
                `
            INSERT INTO PRODUCT_CART
            (ID_CART,
            ID_PRODUCT,
            QUANTITY,
            PRODUCT_CART_PRICE)
            VALUES
            (${cartId},
            ${product.productId},
            ${product.quantity},
            ${product.price});
            `;

            await connection.execute(sqlInsert);
        }

        connection.end();
        res.status(200).send(OK_MSG_API_POST_PASSENGER_TRIP);
    } catch (error) {
        console.log(`${ERROR_MSG_API_POST_PASSENGER_TRIP} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_POST_PASSENGER_TRIP} ${error}`);
    }

    res.end();
};

module.exports = {
    getPassengerTrips,
    postPassengerTrip
};
