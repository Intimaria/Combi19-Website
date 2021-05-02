const express = require('express');
const next = require('next');
const cors = require('cors');
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');

class Server {

    constructor() {
        this.app = next(true);

		this.server = express();
		const { parse } = require('url');

        //this.port = 3001;
		this.port = process.env.PORT || 4200;

        // Middlewares
        this.middlewares();

        // Available routes
        //this.routes();
    }

    middlewares() {

        // CORS
        this.server.use( cors() );

        // Reading and parsing the body
        this.server.use( bodyParser );

    }

    //routes() {
        //this.server.use('/authorization', require('../pages/api/authorization.js'));
        //this.server.use('/drivers', require('../pages/api/employees-drivers.js'));
        //this.server.use('/employee', require('../pages/api/employees-login.js'));
        //this.server.use('/employee', require('../pages/api/employees-products.js'));
        //this.server.use('/employee', require('../pages/api/employees-routes.js'));
        //this.server.use('/transport', require('../pages/api/employees-transports.js'));
        //this.server.use('/employee', require('../pages/api/employees-trips.js'));
        //this.server.use('/login', require('../pages/api/login.js'));
        //this.server.use('/lugares', require('../pages/api/lugares.js'));
        //this.server.use('/register', require('../pages/api/register.js'));
    //}

    listen() {
        this.server.listen( this.port, () => {
            console.log("The server is running on the port ", this.port );
        });
    }

}




module.exports = Server;
