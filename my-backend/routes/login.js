const { Router } = require('express');

const { Login, LoginEmployees } = require("../controllers/login.js");

const router = Router();

router.post("/", Login);

router.post("/employees", LoginEmployees);

module.exports = router;