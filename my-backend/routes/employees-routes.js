const {Router} = require('express');

const {getRoutes, getRouteById, postRoute, putRoute, deleteRoute} = require("../controllers/routes.js");

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all routes
router.get('/', authenticateAdminRol, getRoutes);

// Retrieve a single route by id
router.get('/:id', authenticateAdminRol, getRouteById);

// Create a new route
router.post('/', authenticateAdminRol, postRoute);

// Update a route by id
router.put('/:id', authenticateAdminRol, putRoute);

// Delete a route by id
router.delete('/:id', authenticateAdminRol, deleteRoute);

module.exports = router;
