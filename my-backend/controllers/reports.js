const { prepareConnection } = require("../helpers/connectionDB.js");

const {  normalizePassengers } = require('../helpers/normalizeResult.js');

const {
} = require('../const/messages.js');



const getRiskyPassengers = async (req, res) => {
    try {
        const connection = await prepareConnection();

        const sqlSelect =
                `SELECT * FROM
                USER U INNER JOIN ROLE_USER R ON
                USER_ID=ID_USER
                WHERE R.ID_ROLE = 3
                AND DATE_ADD(U.EXPIRATION_RISK, INTERVAL -1 MONTH) <= NOW()
                AND U.EXPIRATION_RISK >= DATE_ADD(NOW(), INTERVAL -1 MONTH)
                `;
          // AND DATE_ADD(U.EXPIRATION_RISK, INTERVAL -1 MONTH) >= DATE_ADD(NOW(), INTERVAL -1 MONTH)
        const [rows] = await connection.execute(sqlSelect, []);

        connection.end();
        const normalizeResults =  normalizePassengers(rows);
        return res.status(200).send(normalizeResults);
    } catch (error) {
        console.log(`${""}: ${error}`);
        res.status(500).send(`${""}: ${error}`);
    }
    res.end();
};

module.exports = {
  getRiskyPassengers
}