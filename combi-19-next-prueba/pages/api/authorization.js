const { Router } = require('express');

const { verifyToken, authenticateToken } = require("./middlewares/authorization.js");

const router = Router();

router.get("/", authenticateToken, verifyToken);

module.exports = router;
