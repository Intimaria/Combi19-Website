const {prepareConnection} = require("../helpers/connectionDB.js");

const getTrips = async (req, res) => {
    const {start = 1, limit = 5} = req.query;

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
    const {names, surname, email, phoneNumber, password1, password2} = req.body;

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
            res.status(201).send("Se ha registrado el viaje con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al crear el viaje: ', error);
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
