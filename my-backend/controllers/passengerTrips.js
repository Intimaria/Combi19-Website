const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRIPS,
    OK_MSG_API_POST_PASSENGER_TRIP,
    ERROR_MSG_API_POST_PASSENGER_TRIP,
    ERROR_MSG_API_CANCEL_PASSENGER_TRIP,
    OK_MSG_API_CANCEL_PASSENGER_TRIP,
    OK_MSG_API_PUT_TRIP_PASSENGER_TICKET_NOT_RISKY,
    OK_MSG_API_PUT_TRIP_PASSENGER_TICKET_RISKY,
    ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET
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
            tic.TICKET_ID, FORMAT(tri.PRICE, 2, 'es_AR') PRICE, tri.ACTIVE,
            CONCAT(DATE_FORMAT(tri.DEPARTURE_DAY, '%d/%m/%Y %H:%i'), 'hs') DEPARTURE_DAY, 
            CONCAT(c1.CITY_NAME, ', ', p1.PROVINCE_NAME) DEPARTURE, 
            CONCAT(c2.CITY_NAME, ', ', p2.PROVINCE_NAME) DESTINATION,
            CONCAT(DATE_FORMAT(ADDTIME(tri.DEPARTURE_DAY, r.DURATION), '%d/%m/%Y %H:%i'), 'hs') ARRIVAL_DAY,
            tra.INTERNAL_IDENTIFICATION, tra.REGISTRATION_NUMBER, tic.ID_STATUS_TICKET as STATUS,
            tic.QUANTITY, r.DURATION, rp.PERCENTAGE
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
            LEFT JOIN REFUND_PERCENTAGE rp ON tic.ID_REFUND_PERCENTAGE = rp.REFUND_PERCENTAGE_ID
            WHERE u.USER_ID = ${id}
            ORDER BY tri.DEPARTURE_DAY ASC, ARRIVAL_DAY ASC, DEPARTURE ASC, DESTINATION ASC;
            `;
        const [rows] = await connection.execute(sqlSelect);
        connection.end();
        const normalizeResults = normalizeTrips(rows);
        res.status(200).send(normalizeResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_TRIPS} ${error}`);
    }
    res.end();
};


const postPassengerTrip = async (req, res) => {

    const {cart, cardId, userId, isUserGold} = req.body;

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
            (${(cardId) ? cardId : 'NULL'},
            ${userId},
            NOW());
            `;

        const [rows] = await connection.execute(sqlInsert);

        const cartId = rows.insertId;

        for (let i = 0; i < cart.ticket.quantity; i++) {
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
            ${1},
            ${(isUserGold) ? (cart.ticket.price * 0.9) : cart.ticket.price});
            `;

            await connection.execute(sqlInsert);
        }

        for (let product of cart.products) {
            if (product.quantitySelected !== 0) {
                sqlInsert =
                    `
                    INSERT INTO PRODUCT_CART
                    (ID_CART,
                    ID_PRODUCT,
                    QUANTITY,
                    PRODUCT_CART_PRICE)
                    VALUES
                    (${cartId},
                    ${product.idProduct},
                    ${product.quantitySelected},
                    ${(isUserGold) ? (product.price * 0.9) : product.price});
                    `;

                await connection.execute(sqlInsert);
            }
        }

        connection.end();
        res.status(200).send(OK_MSG_API_POST_PASSENGER_TRIP);
    } catch (error) {
        console.log(`${ERROR_MSG_API_POST_PASSENGER_TRIP} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_POST_PASSENGER_TRIP} ${error}`);
    }

    res.end();
};

const getCart = async (id) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
        SELECT ID_CART FROM TICKET T INNER JOIN CART ON ID_CART=CART_ID WHERE TICKET_ID = ${id}`;
        const [rows] = await connection.execute(sqlSelect);
        connection.end();
        if (rows)
            return rows;
    } catch (error) {
        console.log(`Ocurrió un error en getCart: ${error}`);
        return error;
    }
};

const validateLastTicket = async (id, cartId) => {
    try {
        const connection = await prepareConnection();

        const sqlSelect = `
        SELECT * FROM TICKET tic
        WHERE tic.ID_CART = ${cartId}
        AND tic.TICKET_ID <> ${id} 
        AND tic.ID_STATUS_TICKET IN (1);`;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();
        return (rows.length === 0);
    } catch (error) {
        console.log(`Ocurrió un error en validateLastTicket: ${error}`);
        return false;
    }
};

const getProductsPrice = async (cartId) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect =
            `
                SELECT 
                SUM(
                    CASE 
                    WHEN pc.PRODUCT_CART_PRICE IS NULL THEN 0 
                    ELSE pc.PRODUCT_CART_PRICE * pc.QUANTITY
                    END
                ) 
                AS montoTotal 
                FROM CART c
                LEFT JOIN PRODUCT_CART pc ON c.CART_ID = pc.ID_CART
                WHERE c.CART_ID = ${cartId}
                GROUP BY ID_CART;
                `;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        return rows[0].montoTotal;
    } catch (error) {
        console.log(`Ocurrió un error en getProductsPrice: ${error}`);
        return 0;
    }
};

const cancelPassengerTrip = async (req, res) => {
    const {id} = req.params;
    let productPrice = 0;
    const { percentage} = req.body;

    let cartId = await getCart(id);
    console.log("cart id", cartId)
    const isLastTicket = await validateLastTicket(id, cartId[0].ID_CART);
    console.log("is last ticket?", isLastTicket)
    if (isLastTicket) {
        productPrice = await getProductsPrice(cartId[0].ID_CART);
        console.log(productPrice)
    }
    try {
        const connection = await prepareConnection();

        let sqlUpdate = `
                        UPDATE TICKET SET ID_STATUS_TICKET = 4, 
                        ID_REFUND_PERCENTAGE = ${percentage} 
                        WHERE TICKET.TICKET_ID = ${id};
                        `;
        const [rows] = await connection.execute(sqlUpdate);
        connection.end();
        res.status(200).send(productPrice.toString());
    } catch (error) {
        console.log(`${ERROR_MSG_API_CANCEL_PASSENGER_TRIP} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_CANCEL_PASSENGER_TRIP} ${error}`);
    }
    res.end();
};

const confirmPassengerTrip = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();

        let sqlUpdate = `UPDATE TICKET SET ID_STATUS_TICKET = 2 WHERE TICKET_ID = ${id};`;

        await connection.execute(sqlUpdate);

        connection.end();
        res.status(200).send(OK_MSG_API_PUT_TRIP_PASSENGER_TICKET_NOT_RISKY);
    } catch (error) {
        console.log(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${error}`);
    }
    res.end();
};

const rejectPassengerTrip = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();

        let sqlSelect =
            `
            SELECT ca.ID_USER, tri.TRIP_ID
            FROM TICKET tic
            INNER JOIN STATUS_TICKET st ON st.STATUS_TICKET_ID = tic.ID_STATUS_TICKET
            INNER JOIN CART ca ON tic.ID_CART = ca.CART_ID
            INNER JOIN TRIP tri ON tic.ID_TRIP = tri.TRIP_ID
            WHERE tic.TICKET_ID = ${id}
            ORDER BY ca.ID_USER ASC;
            `;

        const [rows] = await connection.execute(sqlSelect);

        const userId = rows[0].ID_USER;
        const tripId = rows[0].TRIP_ID;

        let sqlUpdate = `UPDATE USER SET EXPIRATION_RISK = DATE_ADD(NOW(), INTERVAL 15 DAY) WHERE USER_ID = ${userId}`;

        await connection.execute(sqlUpdate);

        let sqlSafeMode = `SET SQL_SAFE_UPDATES = 0;`;

        await connection.execute(sqlSafeMode);

        sqlUpdate =
            `
            UPDATE TICKET SET ID_STATUS_TICKET = 3 
            WHERE TICKET_ID IN
                (SELECT * FROM (
                    SELECT tic.TICKET_ID
                    FROM TICKET tic
                    INNER JOIN STATUS_TICKET st ON st.STATUS_TICKET_ID = tic.ID_STATUS_TICKET
                    INNER JOIN CART ca ON tic.ID_CART = ca.CART_ID
                    INNER JOIN TRIP tri ON tic.ID_TRIP = tri.TRIP_ID
                    WHERE ca.ID_USER = ${userId}
                    AND tri.DEPARTURE_DAY >= NOW()
                    AND tri.DEPARTURE_DAY < DATE_ADD(NOW(), INTERVAL 15 DAY)
                    AND tri.ID_STATUS_TRIP = 1
                    ) tmpTable
                )
            ;
            `;

        await connection.execute(sqlUpdate);

        sqlSafeMode = `SET SQL_SAFE_UPDATES = 1;`;

        await connection.execute(sqlSafeMode);

        connection.end();
        res.status(200).send(OK_MSG_API_PUT_TRIP_PASSENGER_TICKET_RISKY);
    } catch (error) {
        console.log(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_PUT_TRIP_PASSENGER_TICKET} ${error}`);
    }
    res.end();
};

module.exports = {
    getPassengerTrips,
    postPassengerTrip,
    cancelPassengerTrip,
    confirmPassengerTrip,
    rejectPassengerTrip
};
