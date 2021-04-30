const {prepareConnection} = require("../helpers/connectionDB.js");

const getProducts = async (req, res) => {
    const {start = 1, limit = 5} = req.query;

    try {
        const connection = await prepareConnection();
        /*
        Continue with the code
         */
        connection.end();
        return res.status(200).send(rows);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener los datos de todos los productos: ', error);
        res.status(500);
    }
}

const getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const connection = await prepareConnection();
        /*
        Continue with the code
         */
        connection.end();
        return res.status(200).send(rows[0]);
    } catch (error) {
        console.log('Ha ocurrido un error al obtener al producto indicado: ', error);
        res.status(500);
    }

}

const postProduct = async (req, res) => {
    const {names, surname, email, phoneNumber, password1, password2} = req.body;

    const inputsErrors = await validateProducts(/*COMPLETE WITH THE RIGHT PARAMETERS*/);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    } else {
        try {
            const connection = await prepareConnection();
            /*
            Continue with the code
             */
            connection.end();
            res.status(201).send("Se ha registrado el producto con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al crear el producto: ', error);
            res.status(500);
        }

    }
    ;
}

const putProduct = async (req, res) => {
    const {id} = req.params;

    const inputsErrors = await validateProducts(/*COMPLETE WITH THE RIGHT PARAMETERS*/);

    if (inputsErrors) {
        res.status(400).json(inputsErrors);
    }
    else {
        try {
            const connection = await prepareConnection();
            /*
            Continue with the code
             */

            connection.end();
            res.status(201).send("Se ha actualizado los datos del producto con éxito");
        } catch (error) {
            console.log('Ha ocurrido un error al actualizar los datos del producto: ', error);
            res.status(500);
        }
    };

}

const deleteProduct = async (req, res) => {
    const {id} = req.params;
    /*
    Continue with the code
     */
}

module.exports = {
    getProducts,
    getProductById,
    postProduct,
    putProduct,
    deleteProduct
}
