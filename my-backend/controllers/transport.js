const {prepareConnection} = require("../helpers/connectionDB.js");

const transportGet = async (req, res = response) => {
    const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();

        let sqlSelect = `SELECT * FROM TRANSPORT ORDER BY TRANSPORT_ID ASC LIMIT ${start - 1}, ${limit}`;
        const [rows] = await connection.execute(sqlSelect);

        connection.end();

        res.json(rows);
    } catch (e) {
        console.log('Ocurrió un error al obtener los transportes:', e)
    }

}

const transportPost = async (req, res) => {
    const {INTERNAL_IDENTIFICATION, MODEL, REGISTRATION_NUMBER, SEATING, ID_TYPE_COMFORT, ID_DRIVER} = req.body;

    try {
        const connection = await prepareConnection();

        let sqlInsert = "INSERT INTO `TRANSPORT`(`INTERNAL_IDENTIFICATION`, `MODEL`, `REGISTRATION_NUMBER`, `SEATING`, `ID_TYPE_COMFORT`, `ID_DRIVER`) VALUES (?,?,?,?,?,?)"
        const [rows] = await connection.execute(sqlInsert, [INTERNAL_IDENTIFICATION, MODEL, REGISTRATION_NUMBER, SEATING, ID_TYPE_COMFORT, ID_DRIVER]);

        connection.end();

        res.status(201).send("Se ha creado la combi con éxito");
    } catch (e) {
        console.log("Ocurrió un error al crear la combi:", e);
    }
};

module.exports = {
    transportGet,
    //transportPut,
    transportPost//,
    //transportPatch,
    //transportDelete
}
