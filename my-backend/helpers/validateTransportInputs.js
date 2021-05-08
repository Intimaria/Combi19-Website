const {prepareConnection} = require("./connectionDB.js");

const {
    ERROR_MSG_API_POST_TRANSPORT_EXISTING_INTERNAL_IDENTIFICATION,
    ERROR_MSG_API_POST_TRANSPORT_EXISTING_REGISTRATION_NUMBER
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

const prepareTransportsResponse = () => {
    return {
        internalIdentificationError,
        registrationNumberError
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
            internalIdentificationError = ERROR_MSG_API_POST_TRANSPORT_EXISTING_INTERNAL_IDENTIFICATION;
            return false;
        } else {
            internalIdentificationError = null;
            return true;
        }

    } catch (error) {
        console.log('Ocurrió un error al verificar si la identificación interna es única:', error);
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
            registrationNumberError = ERROR_MSG_API_POST_TRANSPORT_EXISTING_REGISTRATION_NUMBER;
            return false;
        } else {
            registrationNumberError = null;
            return true;
        }

    } catch (error) {
        console.log('Ocurrió un error al verificar si la patente es única:', error);
    }
};

module.exports = {
    validateTransportToCreate
};
