const { Router } = require('express');

const { getPassengersValues } = require('../controllers/passengerValues.js');

const { authenticatePassengerRol } = require('../middlewares/authorization');

const router = Router();

router.get("/:id", authenticatePassengerRol, getPassengersValues);

module.exports = router;
