const { prepareConnection } = require("./connectionDB.js");

const {
    ERROR_MSG_EMPTY_PRICE_PRODUCT,
    ERROR_MSG_EMPTY_NAME_PRODUCT,
    ERROR_MSG_INVALID_PRICE_PRODUCT,
    ERROR_MSG_INVALID_NAME_PRODUCT,
    ERROR_MSG_EXISTING_NAME_PRODUCT,
    ERROR_MSG_EMPTY_TYPE_PRODUCT,
    ERROR_MSG_INVALID_TYPE_PRODUCT } = require('../const/messages.js');

const {
    REGEX_ONLY_ALPHABETICAL,
    REGEX_ONLY_DECIMAL_NUMBER,
    REGEX_ONLY_NUMBER } = require('../const/regex.js');

const {
    ACTIVE,
    TICKET_PENDING_STATUS,
    TICKET_ON_TRACK_STATUS } = require('../const/config.js');

let nameError;
let priceError;
let errorTypeProduct;
const validateProductsToCreate = async (names, price, typeProduct) => {
    return (await validateProducts(names, price, typeProduct) && await checkProductNameInDbToCreate(names)) ? null : prepareRoutesResponse();
}

const validateProductsToModify = async (names, price, typeProduct, id) => {
    return (await validateProducts(names, price, typeProduct) && await checkProductNameInDbToModify(names, id)) ? null : prepareRoutesResponse();
}

const validateProducts = async (names, price, typeProduct) => {
    return (validateName(names) & validatePrice(price) & await validateTypeProduct(typeProduct));
}

const prepareRoutesResponse = () => {
    return {
        nameError,
        priceError,
        errorTypeProduct
    }
}
const checkProductNameInDbToCreate = async (names) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM PRODUCT WHERE PRODUCT_NAME = ? AND ACTIVE = ?';
        const [rows] = await connection.execute(sqlSelect, [names, ACTIVE]);
        connection.end();

        if (rows.length >= 1) {
            nameError = ERROR_MSG_EXISTING_NAME_PRODUCT;
            return false;
        }
        return true;
    } catch (error) {
        console.log("Ocurrió un error al comprobar el nombre del producto", error);
        return false;
    }
};

const checkProductNameInDbToModify = async (names, id) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM PRODUCT WHERE PRODUCT_NAME = ? AND ACTIVE = ? AND PRODUCT_ID <> ?';
        const [rows] = await connection.execute(sqlSelect, [names, ACTIVE, id]);
        connection.end();

        if (rows.length >= 1) {
            nameError = ERROR_MSG_EXISTING_NAME_PRODUCT;
            return false;
        }
        return true;
    } catch (error) {
        console.log("Ocurrió un error al comprobar el nombre del producto", error);
        return false;
    }
};

const checkProductTypeInDb = async (typeProduct) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM TYPE_PRODUCT WHERE TYPE_PRODUCT_ID = ?';
        const [rows] = await connection.execute(sqlSelect, [typeProduct]);
        connection.end();

        return rows.length >= 1
    } catch (error) {
        console.log("Ocurrió un error al comprobar el tipo del producto", error);
        return false;
    }
}

const validateName = (names) => {
    if (!names) {
        nameError = ERROR_MSG_EMPTY_NAME_PRODUCT;
        return false;
    }
    else if (REGEX_ONLY_ALPHABETICAL.test(names) || names.length > 45) {
        nameError = ERROR_MSG_INVALID_NAME_PRODUCT;
        return false;
    }
    nameError = null;
    return true;
}

const validatePrice = (price) => {
    if (!price) {
        priceError = ERROR_MSG_EMPTY_PRICE_PRODUCT;
        return false;
    }
    else if (REGEX_ONLY_DECIMAL_NUMBER.test(price) || price >= 100000 || price <= 0) {
        priceError = ERROR_MSG_INVALID_PRICE_PRODUCT;
        return false;
    }
    priceError = null;
    return true;
}

const validateTypeProduct = async (typeProduct) => {
    console.log(REGEX_ONLY_NUMBER.test(typeProduct));
    if (!typeProduct) {
        errorTypeProduct = ERROR_MSG_EMPTY_TYPE_PRODUCT;
        return false;
    }
    else if (REGEX_ONLY_NUMBER.test(typeProduct) || !await checkProductTypeInDb(typeProduct)) {
        errorTypeProduct = ERROR_MSG_INVALID_TYPE_PRODUCT;
        return false;
    }

    errorTypeProduct = null;
    return true;
}

module.exports = {
    validateProductsToCreate,
    validateProductsToModify
}
