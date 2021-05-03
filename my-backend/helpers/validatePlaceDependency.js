const { prepareConnection } = require("./connectionDB.js");

const validatePlaceDependency = async (id) => {
        const connection = await prepareConnection();
        connection.query('SELECT * FROM CITY INNER JOIN ROUTE ON (CITY_ID=ID_DESTINATION) UNION SELECT * FROM CITY INNER JOIN ROUTE ON (CITY_ID=ID_DEPARTURE) WHERE CITY_ID = ?', [])
        .then((result) => {
            connection.end();
           return result.length >= 1})
    .catch(function(err){
        console.log("Ha ocurrido un error al comprobar las dependencias del lugar", error);
        return false;
	});
}
        
module.exports = {
    validatePlaceDependency
}