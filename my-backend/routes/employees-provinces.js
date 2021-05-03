const { Router } = require('express');

const { getProvinces} = require("../controllers/places");

const { authenticateAdminRol } = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all provincias
router.get('/', authenticateAdminRol, getProvinces);

module.exports = router;
