const { Router } = require('express');

const { findAllDrivers, createDriver, findDriver, uptateDriver, deleteDriver } = require("../controllers/drivers.js");

const { authenticateAdminRol } = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all drivers
router.get('/', authenticateAdminRol, findAllDrivers);

// Create a new driver
router.post('/', authenticateAdminRol, createDriver);

// Retrieve a single driver with id
router.get('/:id', authenticateAdminRol, findDriver);

// Update a driver with id
router.put('/:id', authenticateAdminRol, uptateDriver);

// Delete a driver with id
router.delete('/:id', authenticateAdminRol, deleteDriver);

module.exports = router;