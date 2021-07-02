const {Router} = require('express');

const {
    getDriverTrips,
    finishTrip,
    cancelTrip,
    getPassangerStatus
} = require('../controllers/driverTrips');

// The administrator role should be validated with a middleware before performing any operation
const {authenticateDriverRol} = require("../middlewares/authorization.js");

const router = Router();

// Get trips
router.get('/custom/user/:id/:status', authenticateDriverRol, getDriverTrips);

// Get passenger status 
router.get('/custom/passenger/:id', authenticateDriverRol, getPassangerStatus);

// Finish trip
router.put('/custom/trip/:id', authenticateDriverRol, finishTrip);

// Cancel trip
router.put('/custom/canceltrip/:id', authenticateDriverRol, cancelTrip);

module.exports = router;
