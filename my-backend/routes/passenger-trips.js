const {Router} = require('express');

const {
    getPassengerTrips,
    postPassengerTrip,
    cancelPassengerTrip,
    confirmPassengerTrip,
    rejectPassengerTrip
} = require('../controllers/passengerTrips');

// The administrator role should be validated with a middleware before performing any operation
const {authenticatePassengerRol, authenticateDriverRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all trips
router.get('/custom/user/:id', authenticatePassengerRol, getPassengerTrips);

// Cancel trip
router.put('/custom/trip/:id', authenticatePassengerRol, cancelPassengerTrip);

// Confirm trip
router.put('/confirmPassengerTrip/:id', authenticateDriverRol, confirmPassengerTrip);

// Reject trip
router.put('/rejectPassengerTrip/:id', authenticateDriverRol, rejectPassengerTrip);

// Update cart
router.post('/custom/cartConfirmation/', authenticatePassengerRol, postPassengerTrip);

module.exports = router;
