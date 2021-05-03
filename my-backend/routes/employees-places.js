const { Router } = require('express');

const { getProvinces, getPlaces, postPlace, getPlaceById, putPlace, deletePlace } = require("../controllers/places");

const { authenticateAdminRol } = require("../middlewares/authorization.js");


const router = Router();

// Retrieve all provincias
//router.get('/', authenticateAdminRol, getProvinces);

// Retrieve all lugares
router.get('/', authenticateAdminRol, getPlaces);

// Create a new lugares
router.post('/', authenticateAdminRol, postPlace);

// Retrieve a single lugares by id
router.get('/:id', authenticateAdminRol, getPlaceById);

// Update a lugares by id
router.put('/:id', authenticateAdminRol, putPlace);

// Delete a lugares by id
router.delete('/:id', authenticateAdminRol, deletePlace);

module.exports = router;
