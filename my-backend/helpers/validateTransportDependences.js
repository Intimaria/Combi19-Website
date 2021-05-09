const { prepareConnection } = require("./connectionDB.js");

const validateTransportRouteDependence = async (id) => {
    try {
        const connection = await prepareConnection();

        const sqlSelect =

            `
            SELECT t.TRANSPORT_ID, t.ACTIVE, r.ROUTE_ID, r.ACTIVE
            FROM TRANSPORT t
            INNER JOIN ROUTE r ON t.TRANSPORT_ID = r.ID_TRANSPORT
            WHERE t.TRANSPORT_ID = ${id}
            AND t.ACTIVE = 1;
            `;

        const [rows] = await connection.execute(sqlSelect);
        connection.end();

        return rows.length >= 1;

    } catch (error) {
        console.log("Ha ocurrido un error al comprobar las dependencias de la combi", error);
        return false;
    }
}

module.exports = {
    validateTransportRouteDependence
}
