const {Router} = require('next/router');

const {LoginEmployees} = require("./controllers/login.js");

const router = Router();

router.post("/login", LoginEmployees);

module.exports = router;
