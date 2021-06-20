const { Router } = require('express');

const { getEmailToRemindPassword, postNewRecoveredPassword } = require("../controllers/recoverPassword");

const router = Router();

router.post("/getEmail", getEmailToRemindPassword);

router.put("/postNewPassword", postNewRecoveredPassword);

module.exports = router;