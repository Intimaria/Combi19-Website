const {Router} = require('express');
const {
    getTrips,
    getTripById,
    getTripDependenceById,
    postTrip,
    putTrip,
    deleteTrip,
    searchTrip
} = require('../controllers/trips');

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all trips
router.get('/', authenticateAdminRol, getTrips);

// Retrieve a single trip by id
router.get('/:id', authenticateAdminRol, getTripById);

// Retrieve trip dependence by id
router.get('/custom/tripDependenceById/:id', authenticateAdminRol, getTripDependenceById);

// Create a new trip
router.post('/', authenticateAdminRol, postTrip);

// Update a trip by id
router.put('/:id', authenticateAdminRol, putTrip);

// Delete a trip by id
router.delete('/:id', authenticateAdminRol, deleteTrip);

// Search Trips
router.post('/custom/searchTrips/', searchTrip);

module.exports = router;
