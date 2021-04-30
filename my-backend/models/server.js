const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app  = express();
        this.port = 3001;

        // Middlewares
        this.middlewares();

        // Available routes
        this.routes();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Reading and parsing the body
        this.app.use( express.json() );

    }

    routes() {
        this.app.use('/authorization', require('../routes/authorization.js'));
        this.app.use('/drivers', require('../routes/employees-drivers.js'));
        this.app.use('/employee', require('../routes/employees-login.js'));
        this.app.use('/employee', require('../routes/employees-products.js'));
        this.app.use('/employee', require('../routes/employees-routes.js'));
        this.app.use('/transport', require('../routes/employees-transports.js'));
        this.app.use('/employee', require('../routes/employees-trips.js'));
        this.app.use('/login', require('../routes/login.js'));
        this.app.use('/lugares', require('../routes/lugares.js'));
        this.app.use('/register', require('../routes/register.js'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log("The server is running on the port ", this.port );
        });
    }

}




module.exports = Server;
