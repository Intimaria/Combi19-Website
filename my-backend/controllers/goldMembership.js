const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    OK_MSG_API_PUT_GOLD_MEMBERSHIP,
    ERROR_MSG_API_PUT_GOLD_MEMBERSHIP,
} = require("../const/messages");

const putGoldMembership = async (req, res) => {
    const {id} = req.params;

    const {automaticDebit} = req.body;

    try {
        const connection = await prepareConnection();

        let sqlUpdate =
            `
                UPDATE USER 
                SET AUTOMATIC_DEBIT = ${automaticDebit}
                WHERE USER_ID = ${id};
              `;

        await connection.execute(sqlUpdate);

        connection.end();
        res.status(200).send(OK_MSG_API_PUT_GOLD_MEMBERSHIP);
    } catch (error) {
        console.log(`${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${error}`);
        res.status(500).send(`${ERROR_MSG_API_PUT_GOLD_MEMBERSHIP} ${error}`);
    }

    res.end();
};

module.exports = {
    putGoldMembership
};
