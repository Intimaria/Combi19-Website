const {prepareConnection} = require("../helpers/connectionDB.js");

const transportGet = async (req, res = response) => {
    const connection = await prepareConnection();

    const {start = 1, limit = 5} = req.query;

    let sqlSelect = `SELECT * FROM TRANSPORT ORDER BY TRANSPORT_ID ASC LIMIT ${start}, ${limit}`;

    const [rows] = await connection.execute(sqlSelect);

    console.log("rows: ", rows);

    connection.end();

    res.json(rows);
}

const transportPost = async (req, res) => {
    const {INTERNAL_IDENTIFICATION, MODEL, REGISTRATION_NUMBER, SEATING, ID_TYPE_COMFORT, ID_DRIVER} = req.body;

    console.log(INTERNAL_IDENTIFICATION, MODEL, REGISTRATION_NUMBER, SEATING, ID_TYPE_COMFORT, ID_DRIVER)

    const connection = await prepareConnection();
    let sqlInsert = "INSERT INTO `TRANSPORT`(`INTERNAL_IDENTIFICATION`, `MODEL`, `REGISTRATION_NUMBER`, `SEATING`, `ID_TYPE_COMFORT`, `ID_DRIVER`) VALUES (?,?,?,?,?,?)"
    const [rows] = await connection.execute(sqlInsert, [INTERNAL_IDENTIFICATION, MODEL, REGISTRATION_NUMBER, SEATING, ID_TYPE_COMFORT, ID_DRIVER]);
    connection.end();
    res.status(201).send("Se ha creado la combi con éxito");


};

module.exports = {
    transportGet,
    //transportPut,
    transportPost//,
    //transportPatch,
    //transportDelete
}
