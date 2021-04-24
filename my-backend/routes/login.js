const { Router } = require('express');

const { LoginPassengers , LoginEmployees } = require("../controllers/login.js");

const router = Router();

router.post("/", LoginPassengers);

router.post("/employees", LoginEmployees);

module.exports = router;