const {Router} = require('express');

const {LoginPassengers} = require("../controllers/login.js");

const router = Router();

router.post("/", LoginPassengers);

module.exports = router;
