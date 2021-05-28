const {prepareConnection} = require("../helpers/connectionDB.js");

const {
    ERROR_MSG_API_GET_TRIPS,
    OK_MSG_API_TRIP_POST,
    ERROR_MSG_API_POST_TRIP,
    ERROR_MSG_API_TRIP_DATE_OVERLAP,
    ERROR_MSG_API_TRIP_VALIDATE_DATE_OVERLAP,
    OK_MSG_API_PUT_TRIP,
    ERROR_MSG_API_PUT_TRIP,
    OK_MSG_API_DELETE_TRIP,
    ERROR_MSG_API_DELETE_TRIP,
    ERROR_MSG_API_TRIP_VALIDATE_TICKET_DEPENDENCE
} = require("../const/messages");

const getTrips = async (req, res) => {
    //const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();
        /*
        Continue with the code
         */
        connection.end();
        return res.status(200).send(rows);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener los datos de todos los viajes: ', error);
        res.status(500);
    }
    res.end();
};

const getTripById = async (req, res) => {
    try {
        const {id} = req.params;
        const connection = await prepareConnection();
        /*
        Continue with the code
         */
        connection.end();
        return res.status(200).send(rows[0]);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener al viaje indicado: ', error);
        res.status(500);
    }
    res.end();
};

const postTrip = async (req, res) => {
    const {idRoute, price, departureDay} = req.body;
    console.log('entró');

    // Validar que no se solape las fechas: que la combi no esté en uso en otro lugar
    //const inputsErrors = await validateTrips(/*COMPLETE WITH THE RIGHT PARAMETERS*/);

    const inputsErrors = false;

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();

            let sqlInsert =
                `
                INSERT INTO TRIP
                (ID_ROUTE, PRICE, DEPARTURE_DAY)
                VALUES (${idRoute}, ${price}, '${departureDay}');
                `;

            await connection.execute(sqlInsert);

            connection.end();
            res.status(201).send(OK_MSG_API_TRIP_POST);
        } catch (error) {
            console.log(`${ERROR_MSG_API_POST_TRIP} ${error}`);
            res.status(500);
        }

    }
    res.end();
};

const putTrip = async (req, res) => {
    const {id} = req.params;

    const inputsErrors = await validateTrips(/*COMPLETE WITH THE RIGHT PARAMETERS*/);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            /*
            Continue with the code
             */

            connection.end();
            res.status(201).send("Se ha actualizado los datos del viaje con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al actualizar los datos del viaje: ', error);
            res.status(500);
        }
    }
    res.end();
};

const deleteTrip = async (req, res) => {
    const {id} = req.params;
    /*
    Continue with the code
     */
    res.end();
};

module.exports = {
    getTrips,
    getTripById,
    postTrip,
    putTrip,
    deleteTrip
}
