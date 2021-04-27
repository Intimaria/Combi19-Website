const { Router } = require('express');

const { getDrivers, postDriver, getDriverById, putDriver, deleteDriver } = require("../controllers/drivers.js");

// The administrator role should be validated with a middleware before performing any operation
const { authenticateAdminRol } = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all drivers
router.get('/', authenticateAdminRol, getDrivers);

// Create a new driver
router.post('/', authenticateAdminRol, postDriver);

// Retrieve a single driver with id
router.get('/:id', authenticateAdminRol, getDriverById);

// Update a driver with id
router.put('/:id', authenticateAdminRol, putDriver);

// Delete a driver with id
router.delete('/:id', authenticateAdminRol, deleteDriver);

module.exports = router;