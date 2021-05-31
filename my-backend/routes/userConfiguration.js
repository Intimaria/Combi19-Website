const { Router } = require('express');

const { userConfigurationWitoutNewPassword, userConfigurationWithNewPassword} = require('../controllers/userConfiguration');

const { authenticatePassengerRol } = require('../middlewares/authorization');

const router = Router();

router.put("/withNewPassword/:id", authenticatePassengerRol, userConfigurationWithNewPassword);

router.put("/witoutNewPassword/:id", authenticatePassengerRol, userConfigurationWitoutNewPassword);

module.exports = router;