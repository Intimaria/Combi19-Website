const { Router } = require('express');

const { verifyToken, authenticatePassengerRol } = require("../middlewares/authorization.js");

const router = Router();

router.get("/passangers", authenticatePassengerRol, verifyToken);

module.exports = router;