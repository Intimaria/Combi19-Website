const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_LAST_CARD
} = require("../const/messages");

const {normalizeCards} = require("../helpers/normalizeResult");

const getCardsByUser = async (req, res) => {
    const {id} = req.params;

    try {
        const connection = await prepareConnection();

        let sqlSelect =
            `
            SELECT * FROM CARD
            WHERE ID_PASSENGER = ${id}
            ORDER BY CARD_ID DESC
            LIMIT 1;
            `;

        const [rows] = await connection.execute(sqlSelect);

        const normalizeResults = normalizeCards(rows);

        return res.status(200).send(normalizeResults);
    } catch (error) {
        console.log(`${ERROR_MSG_API_GET_LAST_CARD} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_GET_LAST_CARD} ${error}`);
    }
    res.end();
};

module.exports = {
    getCardsByUser
};
