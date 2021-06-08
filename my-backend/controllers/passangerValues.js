const { prepareConnection } = require("../helpers/connectionDB.js");

const getPassangersValues = async(req, res) => {
    const { id } = req.params;
    let userData = { userName: '', userSurname: '', userBirthday: '', userId: '', userEmail: '', userRoleId: '', expirationRisk: '' };
    try {
        const connection = await prepareConnection();

        const sqlSelect = 'SELECT USER_ID, NAME, SURNAME, EMAIL, BIRTHDAY, EXPIRATION_RISK FROM USER WHERE USER_ID = ?';
        const [rows] = await connection.execute(sqlSelect, [id]);

        connection.end();

        if (rows.length === 1) {
            userData.userName = rows[0].NAME;
            userData.userSurname = rows[0].SURNAME;
            userData.userEmail = rows[0].EMAIL;
            userData.userBirthday = rows[0].BIRTHDAY ? rows[0].BIRTHDAY.toISOString().substring(0,10) : '';
            userData.userId = rows[0].USER_ID;
            userData.expirationRisk = rows[0].EXPIRATION_RISK ? rows[0].EXPIRATION_RISK.toISOString().substring(0,10) : '';
            return res.status(200).send({userData});
        }
        else {
            return res.status(400).json('No existe tal usuario en el sistema');
        }
    } catch (error) {
        console.log("Ocurrió un error al obtener los datos del usuario:", error);
        res.status(500).send("Ocurrió un error al obtener los datos del usuario:", error);
    }
}

module.exports = {
    getPassangersValues
}