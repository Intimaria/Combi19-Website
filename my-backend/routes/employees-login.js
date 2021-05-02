const {Router} = require('express');

const {LoginEmployees} = require("../controllers/login.js");

const router = Router();

router.post("/", LoginEmployees);

module.exports = router;
