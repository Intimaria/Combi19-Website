const {Router} = require('express');

const {
    getDriverTrips,
    finishTrip,
    cancelTrip,
    getPassangerStatus,
    getUnsoldDriverTrips,
    validateAccountToSellTrip
} = require('../controllers/driverTrips');

const {
    postPassengerTrip
} = require('../controllers/passengerTrips');

// The administrator role should be validated with a middleware before performing any operation
const {authenticateDriverRol} = require("../middlewares/authorization.js");
 
const router = Router();

// Get trips
router.get('/custom/user/:id/:status', authenticateDriverRol, getDriverTrips);

// Get unsold trips
router.get('/custom/user/:id', authenticateDriverRol, getUnsoldDriverTrips);

// Get passenger status 
router.get('/custom/passenger/:id', authenticateDriverRol, getPassangerStatus);

// Finish trip
router.put('/custom/trip/:id', authenticateDriverRol, finishTrip);

// Sell trip
router.post('/custom/validateaccounttoselltrip/', authenticateDriverRol, validateAccountToSellTrip);

// Sell trip
router.post('/custom/selltrip/', authenticateDriverRol, postPassengerTrip);

// Cancel trip
router.put('/custom/canceltrip/:id', authenticateDriverRol, cancelTrip);

module.exports = router;
