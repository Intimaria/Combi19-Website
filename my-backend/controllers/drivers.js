const { prepareConnection } = require("../helpers/connectionDB.js");

const findAllDrivers = async(req,res) => {
    const connection = await prepareConnection();
    const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL FROM `user` `a` INNER JOIN  `role_user` `r` ON (`a.USER_ID` = `r.ID_USER`) WHERE `r.ID_ROLE` = (?)';
    const [rows] = await connection.execute(sqlSelect, [2]);
    connection.end();
    return res.status(200).send(rows);
}

const createDriver = async(req,res) => {
    const { names, surname, email, phoneNumber, password1, password2 } = req.body;

    const inputsErrors = await validateDrivers(email, names, surname, password1, password2, phoneNumber);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    }
    else {
        const connection = await prepareConnection();
        let sqlInsert = "INSERT INTO `user`(`NAME`, `SURNAME`, `EMAIL`, `PASSWORD`,`PHONE_NUMBER`) VALUES (?,?,?,?,?)"
        const [rows] = await connection.execute(sqlInsert, [names, surname, email, password1, phoneNumber]);

        const id = rows.insertId;
        sqlInsert = 'INSERT INTO `role_user`(`ID_ROLE`, `ID_USER`) VALUES (?,?)'
        connection.execute(sqlInsert, [2,id]);
        
        connection.end();
        res.status(201).send("Se ha registrado el chofer con exito");
    };
}

const findDriver = async(req,res) => {
    const connection = await prepareConnection();
    const { driverId } = req.body;
    const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL, PHONE_NUMBER FROM `user` `a` INNER JOIN  `role_user` `r` ON (`a.USER_ID` = `r.ID_USER`) WHERE `r.ID_ROLE` = (?) AND `a.USER_ID` = (?)';
    const [rows, fields] = await connection.execute(sqlSelect, [2,driverId]);
    connection.end();
    return res.status(200).send(rows[0]);
}

const uptateDriver = async(req,res) => {
    const { driverId, names, surname, email, phoneNumber, password1, password2 } = req.body;

    const inputsErrors = await validateDrivers(email, names, surname, password1, password2, phoneNumber);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    }
    else {
        const connection = await prepareConnection();
        let sqlUptate = "UPDATE `user` SET `NAME`=(?),`SURNAME`=(?),`EMAIL`=(?),`PASSWORD`=(?),`PHONE_NUMBER`=(?) WHERE `USER_ID` = (?)"; 
        const [rows] = await connection.execute(sqlUptate, [names, surname, email, password1, driverId]);
        
        connection.end();
        res.status(201).send("Se ha actualizado los datos del chofer con exito");
    };
}
const deleteDriver = async(req,res) => {
    const connection = await prepareConnection();
    const { driverId } = req.body;
    const sqlSelect = 'DELETE FROM `user` WHERE `USER_ID` = (?)';
    const [rows] = await connection.execute(sqlSelect, [driverId]);
    connection.end();
    return res.status(200).send();
}
module.exports = {
    findAllDrivers,
    createDriver,
    findDriver,
    uptateDriver,
    deleteDriver
}