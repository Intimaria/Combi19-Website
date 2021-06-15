const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRIPS,
    OK_MSG_API_POST_PASSENGER_TRIP,
    ERROR_MSG_API_POST_PASSENGER_TRIP,
    ERROR_MSG_API_CANCEL_PASSENGER_TRIP,
    OK_MSG_API_CANCEL_PASSENGER_TRIP
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
            tic.QUANTITY, r.DURATION
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
        const [rows] = await connection.execute(sqlSelect, [id]);
        connection.end();
        if (rows)
            return rows;
    } catch (error) {
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
        AND tic.ID_STATUS_TICKET IN (1) `;
        const [rows] = await connection.execute(sqlSelect, [cartId, id]);
        console.log("validate last", rows)
        connection.end();
        return (rows.length === 0);
    } catch (error) {
        console.log(error);
        return false;
    }
};

const getProductsPrice = async (cartId) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
        SELECT sum(case when pc.PRODUCT_CART_PRICE is null then 0 else pc.PRODUCT_CART_PRICE end) as montoTotal 
        FROM CART LEFT JOIN
        PRODUCT_CART PC ON ID_CART=CART_ID
        WHERE pc.ID_CART = ${cartId}
        GROUP BY ID_CART`;
        const [rows] = await connection.execute(sqlSelect, [cartId]);
        console.log("products", rows)
        connection.end();
        return rows[0].PRODUCT_CART_PRICE;
    } catch (error) {
        return 0;
    }
};

const cancelPassengerTrip = async (req, res) => {
    const {id} = req.params;
    let productPrice = 0;
    const {status} = req.body
     let cartId = await getCart(id)
    console.log("cart", cartId[0].ID_CART)
    const isLastTicket = await validateLastTicket(id, cartId[0].ID_CART)
    console.log("lastcart", isLastTicket)
        if (isLastTicket) {
            console.log("here")
            productPrice = await getProductsPrice(cartId)
        }
    try {
        const connection = await prepareConnection();
        let sqlUptate = `UPDATE TICKET SET ID_STATUS_TICKET = ${status} WHERE TICKET.TICKET_ID = ${id}`;
        const [rows] = await connection.execute(sqlUptate, [status, id]);
        connection.end();
        res.status(200).send(productPrice.toString());
    } catch (error) {
        console.log(`${ERROR_MSG_API_CANCEL_PASSENGER_TRIP} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_CANCEL_PASSENGER_TRIP} ${error}`);
    }
    res.end();
};

module.exports = {
    getPassengerTrips,
    postPassengerTrip,
    cancelPassengerTrip
};
