const { prepareConnection } = require("../helpers/connectionDB.js");

const {  normalizePassengers } = require('../helpers/normalizeResult.js');

const {
} = require('../const/messages.js');



const getRiskyPassengers = async (req, res) => {
    try {
        const connection = await prepareConnection();

        const sqlSelect =
                `SELECT U.*, D.ABBREVIATION
                FROM
                USER U INNER JOIN ROLE_USER R ON
                USER_ID=ID_USER
                LEFT JOIN DOCUMENT_TYPE D ON U.ID_DOCUMENT_TYPE=DOCUMENT_TYPE_ID
                WHERE R.ID_ROLE = 3
                AND DATE_ADD(U.EXPIRATION_RISK, INTERVAL -15 day) <= NOW()
                AND DATE_ADD(U.EXPIRATION_RISK, INTERVAL -15 day) >= DATE_ADD(NOW(), INTERVAL -1 MONTH)
                ORDER BY U.EXPIRATION_RISK
                `;
          // AND DATE_ADD(U.EXPIRATION_RISK, INTERVAL -1 MONTH) >= DATE_ADD(NOW(), INTERVAL -1 MONTH)
        const [rows] = await connection.execute(sqlSelect, []);
        connection.end();
        const normalizeResults =  normalizePassengers(rows)
        return res.status(200).send(normalizeResults);
    } catch (error) {
        console.log(`Ocurrió un error al obtener los pasajeros con riesgo: ${error}`);
        res.status(500).send(`Ocurrió un error al obtener los pasajeros con riesgo: ${error}`);
    }
    res.end();
};

module.exports = {
  getRiskyPassengers
};
