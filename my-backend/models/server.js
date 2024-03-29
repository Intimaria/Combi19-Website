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
        this.app.use('/employee/login', require('../routes/employees-login.js'));
        this.app.use('/products', require('../routes/employees-products.js'));
        this.app.use('/routes', require('../routes/employees-routes.js'));
        this.app.use('/transports', require('../routes/employees-transports.js'));
        this.app.use('/trips', require('../routes/employees-trips.js'));
        this.app.use('/login', require('../routes/login.js'));
        this.app.use('/places', require('../routes/employees-places.js'));
        this.app.use('/prov', require('../routes/employees-provinces.js'));
        this.app.use('/register', require('../routes/register.js'));
        this.app.use('/userConfiguration', require('../routes/userConfiguration.js'));
        this.app.use('/getPassengersValues', require('../routes/passengerValues.js'));
        this.app.use('/comments', require('../routes/comments.js'));
        this.app.use('/my-trips', require('../routes/passenger-trips.js'));
        this.app.use('/cards', require('../routes/cards.js'));
        this.app.use('/goldMembership', require('../routes/goldMembership.js'));
        this.app.use('/recoverPassword', require('../routes/recoverPassword.js'));
        this.app.use('/tripPassengers', require('../routes/tripPassengers.js'));
        this.app.use('/tripsMade', require('../routes/driver-trips.js'));
        this.app.use('/pendingTrips', require('../routes/driver-trips.js'));
        this.app.use('/reports', require('../routes/employee-reports.js'))
        
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log("The server is running on the port ", this.port );
        });
    }

}




module.exports = Server;
