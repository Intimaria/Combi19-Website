const { prepareConnection } = require("./connectionDB.js");

const validateDriverTransportDependence = async (id) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM USER u INNER JOIN TRANSPORT t ON (u.USER_ID=t.ID_DRIVER) WHERE u.USER_ID = ?';;
        const [rows] = await connection.execute(sqlSelect, [id]);
        connection.end();
        return rows.length >= 1;
    } catch (error) {
        return error
    }
}

/*
const validateDriverTripDependence  = async(id) => {
    try {
        const connection = await prepareConnection();
        const sqlSelect = 'SELECT * FROM USER u INNER JOIN TRIP t ON (u.USER_ID=t.ID_DRIVER) WHERE u.USER_ID = ?';
        const [rows] = await connection.execute(sqlSelect, [id]);
        connection.end();
        return rows.length >= 1;
    } catch (error) {
        return error
    }
}
*/

module.exports = {
    validateDriverTransportDependence /*,
    validateDriverTripDependence */
}