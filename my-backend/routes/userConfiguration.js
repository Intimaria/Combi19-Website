const { Router } = require('express');

const { userConfigurationWithoutNewPassword, userConfigurationWithNewPassword} = require('../controllers/userConfiguration');

const { authenticatePassengerRol } = require('../middlewares/authorization');

const router = Router();

router.put("/withNewPassword/:id", authenticatePassengerRol, userConfigurationWithNewPassword);

router.put("/withoutNewPassword/:id", authenticatePassengerRol, userConfigurationWithoutNewPassword);

module.exports = router;
