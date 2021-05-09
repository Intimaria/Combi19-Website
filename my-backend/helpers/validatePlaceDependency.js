const { prepareConnection } = require("./connectionDB.js");

const validatePlaceDependency = async (id) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM CITY c INNER JOIN ROUTE r ON (c.CITY_ID=r.ID_DESTINATION) UNION SELECT * FROM CITY c INNER JOIN ROUTE r ON (c.CITY_ID=r.ID_DEPARTURE) WHERE c.CITY_ID = ? and r.ACTIVE = ?';
        const [rows] = await connection.execute(sqlSelect, [id,ACTIVE]);
        connection.end();
        return rows.length <= 1;
    } catch (error) {
        console.log("Ha ocurrido un error al comprobar las dependencias del lugar", error);
        return false;
    }
}

const validatePlaceExists = async (cityName, province_id) => {
    console.log(cityName, province_id);
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM CITY c INNER JOIN PROVINCE p ON (p.PROVINCE_ID=c.ID_PROVINCE) WHERE c.CITY_NAME = ? AND c.ID_PROVINCE = ? AND c.ACTIVE = ?';
        const [rows] = await connection.execute(sqlSelect, [cityName, province_id, 1]);
        connection.end();
        console.log(rows, 'length:', rows.length)
        if (rows.length >= 1) {console.log("ya existe:",rows); return true}
        else return false;
    } catch (error) {
        console.log("Ha ocurrido un error al comprobar que el lugar existe", error);
        return MediaStreamTrackAudioSourceNode;
    }
}

module.exports = {
    validatePlaceDependency,
    validatePlaceExists
}