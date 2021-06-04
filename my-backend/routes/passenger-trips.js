const {Router} = require('express');
const {
    getPassengerTrips,
} = require('../controllers/passengerTrips');

// The administrator role should be validated with a middleware before performing any operation
const {authenticatePassengerRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all trips
router.get('/custom/user/:id', authenticatePassengerRol, getPassengerTrips);

module.exports = router;
