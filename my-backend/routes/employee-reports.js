const {Router} = require('express');
const {
    getRiskyPassengers,
} = require("../controllers/reports.js");

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all risky passengers
router.get('/getRiskyPassengers', authenticateAdminRol, getRiskyPassengers);


module.exports = router;
