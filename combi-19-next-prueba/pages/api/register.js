const { Router } = require('express');

const { Register } = require("./controllers/register");

const router = Router();

router.post("/", Register);

module.exports = router;
