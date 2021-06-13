const {prepareConnection} = require("./connectionDB.js");
const {NO_ACTIVE, ACTIVE} = require('../const/config.js');

const validatePlaceDependency = async (id) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
        SELECT * FROM CITY c INNER JOIN ROUTE r ON (c.CITY_ID=r.ID_DESTINATION) 
        WHERE c.CITY_ID = ? and r.ACTIVE = ? 
        UNION 
        SELECT * FROM CITY c INNER JOIN ROUTE r ON (c.CITY_ID=r.ID_DEPARTURE) 
        WHERE c.CITY_ID = ? and r.ACTIVE = ?`;
        const [rows] = await connection.execute(sqlSelect, [id, ACTIVE, id, ACTIVE]);
        connection.end();
        return rows.length >= 1;
    } catch (error) {
        console.log("Ocurrió un error al comprobar las dependencias del lugar", error);
        return false;
    }
};


const validatePlaceExistsForDelete = async (id, idProvince) => {
    console.log(id, idProvince);
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
        SELECT * FROM CITY c INNER JOIN PROVINCE p ON (p.PROVINCE_ID=c.ID_PROVINCE) 
        WHERE c.CITY_ID = ? AND c.ID_PROVINCE = ? AND c.ACTIVE = ?`;
        const [rows] = await connection.execute(sqlSelect, [id, idProvince, ACTIVE]);
        connection.end();

        if (rows.length >= 1) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log("Ocurrió un error al comprobar que el lugar existe", error);
        return true;
    }
};

const validatePlaceExists = async (cityName, province_id) => {
    console.log(cityName, province_id);
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
        SELECT * FROM CITY c INNER JOIN PROVINCE p ON (p.PROVINCE_ID=c.ID_PROVINCE) 
        WHERE c.CITY_NAME = ? AND c.ID_PROVINCE = ? AND c.ACTIVE = ?`;
        const [rows] = await connection.execute(sqlSelect, [cityName, province_id, ACTIVE]);
        connection.end();

        if (rows.length >= 1) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log("Ocurrió un error al comprobar que el lugar existe", error);
        return true;
    }
};

const validatePlaceToUpdate = async (cityName, province_id, id) => {
    console.log(cityName, province_id, id);
    try {
        const connection = await prepareConnection();
        const sqlSelect = `
        SELECT * FROM CITY c INNER JOIN PROVINCE p ON (p.PROVINCE_ID=c.ID_PROVINCE) 
        WHERE c.CITY_NAME = ? AND c.ID_PROVINCE = ? AND c.ACTIVE = ? AND c.CITY_ID <> ?`;
        const [rows] = await connection.execute(sqlSelect, [cityName, province_id, ACTIVE, id]);
        connection.end();

        if (rows.length >= 1) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log("Ocurrió un error al comprobar que el lugar existe", error);
        return true;
    }
};

module.exports = {
    validatePlaceDependency,
    validatePlaceExists,
    validatePlaceToUpdate,
    validatePlaceExistsForDelete
};
