const {Router} = require('express');
const {
    getDrivers,
    getDriverById,
    getAvailableDrivers,
    postDriver,
    putDriver,
    deleteDriver
} = require("../controllers/drivers.js");

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all drivers
router.get('/', authenticateAdminRol, getDrivers);

// Retrieve a single driver by id
router.get('/:id', authenticateAdminRol, getDriverById);

// Retrieve all available drivers
router.get('/custom/available', authenticateAdminRol, getAvailableDrivers);

// Create a new driver
router.post('/', authenticateAdminRol, postDriver);

// Update a driver by id
router.put('/:id', authenticateAdminRol, putDriver);

// Delete a driver by id
router.delete('/:id', authenticateAdminRol, deleteDriver);

module.exports = router;
