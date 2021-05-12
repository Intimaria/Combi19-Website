const {prepareConnection} = require("./connectionDB.js");

const {
    ERROR_MSG_API_TRANSPORT_EXISTING_INTERNAL_IDENTIFICATION,
    ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_INTERNAL_IDENTIFICATION,
    ERROR_MSG_API_TRANSPORT_EXISTING_REGISTRATION_NUMBER,
    ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_REGISTRATION_NUMBER
} = require('../const/messages.js');

let internalIdentificationError = null;
let registrationNumberError = null;

const validateTransportToCreate = async (internalIdentification, registrationNumber) => {
    let isInternalIdentificationValid = await verifyUniqueInternalIdentificationToCreate(internalIdentification);
    if (isInternalIdentificationValid) internalIdentificationError = null;

    let isRegistrationNumberValid = await verifyUniqueRegistrationNumberToCreate(registrationNumber);

    if (isRegistrationNumberValid) registrationNumberError = null;

    if (isInternalIdentificationValid && isRegistrationNumberValid) {
        return null;
    } else {
        return prepareTransportsResponse()
    }
};

const validateTransportToUpdate = async (internalIdentification, registrationNumber, id) => {
    let isInternalIdentificationValid = await verifyUniqueInternalIdentificationToUpdate(internalIdentification, id);
    if (isInternalIdentificationValid) internalIdentificationError = null;

    let isRegistrationNumberValid = await verifyUniqueRegistrationNumberToUpdate(registrationNumber, id);

    if (isRegistrationNumberValid) registrationNumberError = null;

    if (isInternalIdentificationValid && isRegistrationNumberValid) {
        return null;
    } else {
        return prepareTransportsResponse()
    }
};


const verifyUniqueInternalIdentificationToCreate = async (internalIdentification) => {
    try {

        const connection = await prepareConnection();

        const sqlSelect =
            `
            SELECT *        
            FROM TRANSPORT
            WHERE INTERNAL_IDENTIFICATION = '${internalIdentification}';`
        ;

        const [rows] = await connection.execute(sqlSelect);


        connection.end();

        if (rows.length >= 1) {
            internalIdentificationError = ERROR_MSG_API_TRANSPORT_EXISTING_INTERNAL_IDENTIFICATION;
            return false;
        } else {
            internalIdentificationError = null;
            return true;
        }

    } catch (error) {
        console.log(`${ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_INTERNAL_IDENTIFICATION}, error`);
    }
};

const verifyUniqueRegistrationNumberToCreate = async (registrationNumber) => {

    try {
        const connection = await prepareConnection();

        const sqlSelect = `
            SELECT *
            FROM TRANSPORT
            WHERE REGISTRATION_NUMBER = '${registrationNumber}'`;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        if (rows.length >= 1) {
            registrationNumberError = ERROR_MSG_API_TRANSPORT_EXISTING_REGISTRATION_NUMBER;
            return false;
        } else {
            registrationNumberError = null;
            return true;
        }

    } catch (error) {
        console.log(`${ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_REGISTRATION_NUMBER}, error`);
    }
};

const verifyUniqueInternalIdentificationToUpdate = async (internalIdentification, id) => {
    try {

        const connection = await prepareConnection();

        const sqlSelect =
            `
            SELECT *        
            FROM TRANSPORT
            WHERE TRANSPORT_ID <> ${id}
            AND INTERNAL_IDENTIFICATION = '${internalIdentification}';
            `
        ;

        const [rows] = await connection.execute(sqlSelect);


        connection.end();

        if (rows.length >= 1) {
            internalIdentificationError = ERROR_MSG_API_TRANSPORT_EXISTING_INTERNAL_IDENTIFICATION;
            return false;
        } else {
            internalIdentificationError = null;
            return true;
        }

    } catch (error) {
        console.log(`${ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_INTERNAL_IDENTIFICATION}, error`);
    }
};

const verifyUniqueRegistrationNumberToUpdate = async (registrationNumber, id) => {
    try {

        const connection = await prepareConnection();

        const sqlSelect =
            `
            SELECT *        
            FROM TRANSPORT
            WHERE TRANSPORT_ID <> ${id}
            AND REGISTRATION_NUMBER = '${registrationNumber}';
            `
        ;

        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        if (rows.length >= 1) {
            registrationNumberError = ERROR_MSG_API_TRANSPORT_EXISTING_REGISTRATION_NUMBER;
            return false;
        } else {
            registrationNumberError = null;
            return true;
        }

    } catch (error) {
        console.log(`${ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_REGISTRATION_NUMBER}, error`);
    }
};

const prepareTransportsResponse = () => {
    return {
        errorCode: 1,
        internalIdentificationError,
        registrationNumberError
    }
};

module.exports = {
    validateTransportToCreate,
    validateTransportToUpdate
};
