const { Router } = require('express');

const { getPassangersValues } = require('../controllers/passangerValues.js');

const { authenticatePassengerRol } = require('../middlewares/authorization');

const router = Router();

router.get("/:id", authenticatePassengerRol, getPassangersValues);

module.exports = router;