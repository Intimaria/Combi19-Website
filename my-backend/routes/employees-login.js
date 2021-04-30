const {Router} = require('express');

const {LoginEmployees} = require("../controllers/login.js");

const router = Router();

router.post("/login", LoginEmployees);

module.exports = router;
