const {Router} = require('express');
const {
    getTrips,
    getTripById,
    postTrip,
    putTrip,
    deleteTrip
} = require('../controllers/trips');

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all trips
router.get('/', authenticateAdminRol, getTrips);

// Retrieve a single trip by id
router.get('/:id', authenticateAdminRol, getTripById);

// Create a new trip
router.post('/', authenticateAdminRol, postTrip);

// Update a trip by id
router.put('/:id', authenticateAdminRol, putTrip);

// Delete a trip by id
router.delete('/:id', authenticateAdminRol, deleteTrip);

module.exports = router;
