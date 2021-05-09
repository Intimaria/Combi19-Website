const {prepareConnection} = require("./connectionDB.js");

const {
    ERROR_MSG_API_TRANSPORT_EXISTING_INTERNAL_IDENTIFICATION,
    ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_INTERNAL_IDENTIFICATION,
    ERROR_MSG_API_TRANSPORT_EXISTING_REGISTRATION_NUMBER,
    ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_REGISTRATION_NUMBER
} = require('../const/messages.js');

let internalIdentificationError = null;
let registrationNumberError = null;

const validateTransportToCreate = async (internal_identification, registration_number) => {
    let isInternalIdentificationValid = await verifyUniqueInternalIdentificationToCreate(internal_identification);
    if (isInternalIdentificationValid) internalIdentificationError = null;

    let isRegistrationNumberValid = await verifyUniqueRegistrationNumberToCreate(registration_number);

    if (isRegistrationNumberValid) registrationNumberError = null;

    if (isInternalIdentificationValid && isRegistrationNumberValid) {
        return null;
    } else {
        return prepareTransportsResponse()
    }
};

const validateTransportToUpdate = async (internal_identification, registration_number, id) => {
    let isInternalIdentificationValid = await verifyUniqueInternalIdentificationToUpdate(internal_identification, id);
    if (isInternalIdentificationValid) internalIdentificationError = null;

    let isRegistrationNumberValid = await verifyUniqueRegistrationNumberToUpdate(registration_number, id);

    if (isRegistrationNumberValid) registrationNumberError = null;

    if (isInternalIdentificationValid && isRegistrationNumberValid) {
        return null;
    } else {
        return prepareTransportsResponse()
    }
};



const verifyUniqueInternalIdentificationToCreate = async (internal_identification) => {
    try {

        const connection = await prepareConnection();

        const sqlSelect =
            `
            SELECT *        
            FROM TRANSPORT
            WHERE ACTIVE = 1 
            AND INTERNAL_IDENTIFICATION = '${internal_identification}';`
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

const verifyUniqueRegistrationNumberToCreate = async (registration_number) => {

    try {
        const connection = await prepareConnection();

        const sqlSelect = `
            SELECT *
            FROM TRANSPORT
            WHERE ACTIVE = 1 
            AND REGISTRATION_NUMBER = '${registration_number}'`;

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

const verifyUniqueInternalIdentificationToUpdate = async(internal_identification, id) => {
    try {

        const connection = await prepareConnection();

        const sqlSelect =
            `
            SELECT *        
            FROM TRANSPORT
            WHERE TRANSPORT_ID <> ${id}
            AND INTERNAL_IDENTIFICATION = '${internal_identification}';
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

const verifyUniqueRegistrationNumberToUpdate = async(registration_number, id) => {
    try {

        const connection = await prepareConnection();

        const sqlSelect =
            `
            SELECT *        
            FROM TRANSPORT
            WHERE TRANSPORT_ID <> ${id}
            AND REGISTRATION_NUMBER = '${registration_number}';
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
        internalIdentificationError,
        registrationNumberError
    }
};

module.exports = {
    validateTransportToCreate,
    validateTransportToUpdate
};
