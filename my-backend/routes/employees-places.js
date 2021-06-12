const { Router } = require('express');

const { getProvinces, getPlacesWithDependencies, getPlaceDependenceById, getActivePlaces, getPlaces, postPlace, getPlaceById, putPlace, deletePlace } = require("../controllers/places");

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

// Retrieve all actives lugares
router.get('/custom/actives', getActivePlaces);

// Retrieve place dependence by id
router.get('/custom/placeDependencyById/:id', authenticateAdminRol, getPlaceDependenceById);

// Retrieve places with dependences column
router.get('/custom/deps', authenticateAdminRol, getPlacesWithDependencies);

// Update a lugares by id
router.put('/:id', authenticateAdminRol, putPlace);

// Delete a lugares by id
router.delete('/:id', authenticateAdminRol, deletePlace);

module.exports = router;
