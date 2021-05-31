const {prepareConnection} = require("../helpers/connectionDB.js");
const {
    ERROR_MSG_API_GET_PRODUCTS,
    ERROR_MSG_API_GET_PRODUCT_BY_ID,
    ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE,
    OK_MSG_API_POST_PRODUCT,
    ERROR_MSG_API_POST_PRODUCT,
    OK_MSG_API_PUT_PRODUCT,
    ERROR_MSG_API_PUT_PRODUCT,
    OK_MSG_API_DELETE_PRODUCT,
    ERROR_MSG_API_DELETE_PRODUCT,
    ERROR_MSG_API_PUT_PRODUCT_VALIDATE_CLIENT_DEPENDENCE
} = require('../const/messages.js');

const {
    NO_ACTIVE,
    ACTIVE,
    TICKET_PENDING_STATUS,
    TICKET_ON_TRACK_STATUS
} = require('../const/config.js');

const {normalizeProducts} = require("../helpers/normalizeResult.js");
const {
    validateProductsToCreate,
    validateProductsToModify,
    validateProductClientDependence
} = require("../helpers/validateProducts.js")

const getProducts = async (req, res) => {
    // const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM PRODUCT p INNER JOIN TYPE_PRODUCT tp ON (tp.TYPE_PRODUCT_ID=p.ID_TYPE_PRODUCT) ORDER BY PRODUCT_NAME ASC';
        const [rows] = await connection.execute(sqlSelect);
        connection.end();
        const normalizedResults = normalizeProducts(rows);
        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(ERROR_MSG_API_GET_PRODUCTS, error);
        res.status(500).send(`${ERROR_MSG_API_GET_PRODUCTS}`);
    }
    res.end();
}

const getAvailableProducts = async (req, res) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM PRODUCT p INNER JOIN TYPE_PRODUCT tp ON (tp.TYPE_PRODUCT_ID=p.ID_TYPE_PRODUCT) WHERE ACTIVE = ? ORDER BY PRODUCT_NAME ASC';
        const [rows] = await connection.execute(sqlSelect, [ACTIVE]);
        connection.end();
        const normalizedResults = normalizeProducts(rows);
        return res.status(200).send(normalizedResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE}`);
    }
    res.end();
}

const getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM PRODUCT p INNER JOIN TYPE_PRODUCT tp ON (tp.TYPE_PRODUCT_ID=p.ID_TYPE_PRODUCT) WHERE PRODUCT_ID = ? ORDER BY PRODUCT_NAME ASC';
        const [rows] = await connection.execute(sqlSelect, [id]);
        connection.end();
        const normalizedResults = normalizeProducts(rows);
        return res.status(200).send(normalizedResults[0]);
    } catch (error) {
        console.log(ERROR_MSG_API_GET_PRODUCT_BY_ID, error);
        res.status(500).send(`${ERROR_MSG_API_GET_PRODUCT_BY_ID}`);
    }
    res.end();
}

const postProduct = async (req, res) => {
    const {name, price, typeProduct} = req.body;

    const inputsErrors = await validateProductsToCreate(name, price, typeProduct);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlInsert = "INSERT INTO PRODUCT (ID_TYPE_PRODUCT, PRODUCT_NAME, PRICE, ACTIVE) VALUES (?,?,?,?)"
            const [rows] = await connection.execute(sqlInsert, [typeProduct, name, price, ACTIVE]);
            connection.end();
            res.status(201).send(OK_MSG_API_POST_PRODUCT);
        } catch (error) {
            console.log(ERROR_MSG_API_POST_PRODUCT, error);
            res.status(500).send(`${ERROR_MSG_API_POST_PRODUCT}`);
        }

    }
    res.end();
}

const putProduct = async (req, res) => {
    const {id} = req.params;
    const {name, price, typeProduct} = req.body;
    const inputsErrors = await validateProductsToModify(name, price, typeProduct, id);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            let sqlUpdate = "UPDATE PRODUCT SET ID_TYPE_PRODUCT= ?, PRODUCT_NAME= ?, PRICE= ? WHERE PRODUCT_ID = ?";
            const [rows] = await connection.execute(sqlUpdate, [typeProduct, name, price, id]);
            connection.end();
            res.status(201).send(OK_MSG_API_PUT_PRODUCT);
        } catch (error) {
            console.log(ERROR_MSG_API_PUT_PRODUCT, error);
            res.status(500).send(`${ERROR_MSG_API_PUT_PRODUCT}`);
        }
    }
    res.end();
}

const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const connection = await prepareConnection();
        const sqlUpdate = 'UPDATE PRODUCT SET ACTIVE= ? WHERE PRODUCT_ID = ?';
        const [rows] = await connection.execute(sqlUpdate, [NO_ACTIVE, id]);
        connection.end();
        return res.status(200).send(OK_MSG_API_DELETE_PRODUCT);
    } catch (error) {
        console.log(`${ERROR_MSG_API_DELETE_PRODUCT} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_DELETE_PRODUCT}`);
    }
    res.end();
}

const getProductDependenceById = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM PRODUCT_CART pc INNER JOIN CART c ON (c.CART_ID=pc.ID_CART) INNER JOIN TICKET t ON (t.ID_CART=c.CART_ID) WHERE pc.ID_PRODUCT = ? AND (t.ID_STATUS_TICKET = ? OR t.ID_STATUS_TICKET = ?)';
        const [rows] = await connection.execute(sqlSelect, [id, TICKET_PENDING_STATUS, TICKET_ON_TRACK_STATUS]);
        connection.end();

        res.json({
            productClientDependence: rows.length >= 1
        });
    } catch (error) {
        console.log(`${ERROR_MSG_API_PUT_PRODUCT_VALIDATE_CLIENT_DEPENDENCE} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_PUT_PRODUCT_VALIDATE_CLIENT_DEPENDENCE}`);
    }
    res.end();
};

module.exports = {
    getProducts,
    getProductById,
    postProduct,
    putProduct,
    deleteProduct,
    getAvailableProducts,
    getProductDependenceById
}
