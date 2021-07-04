const {Router} = require('express');

const {
    getDriverPendingTrips,
    getDriverFinishedTrips,
    finishTrip,
    cancelTrip,
    getPassangerStatus,
    validateAccountToSellTrip
} = require('../controllers/driverTrips');

const {
    postPassengerTrip
} = require('../controllers/passengerTrips');

// The administrator role should be validated with a middleware before performing any operation
const {authenticateDriverRol} = require("../middlewares/authorization.js");

const router = Router();

// Get pending trips
router.get('/custom/pendingTrips/:id', authenticateDriverRol, getDriverPendingTrips);

// Get finished trips
router.get('/custom/finishedTrips/:id', authenticateDriverRol, getDriverFinishedTrips);

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
