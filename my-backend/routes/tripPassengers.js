const {Router} = require('express');

const {
    getPassengersByTrip,
    absentPassengersByTrip
} = require('../controllers/tripPassengers');

const {authenticateDriverRol} = require('../middlewares/authorization');

const router = Router();

// Retrieve all passenger used by an specific trip id
router.get('/getPassengersByTrip/:id', authenticateDriverRol, getPassengersByTrip);

// Changes the status to absent of all the passages by an specific user id
router.put('/absentPassengersByTrip/:id', authenticateDriverRol, absentPassengersByTrip);

module.exports = router;
