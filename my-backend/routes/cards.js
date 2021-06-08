const {Router} = require('express');

const {getCardsByUser} = require('../controllers/cards');

const {authenticatePassengerRol} = require('../middlewares/authorization');

const router = Router();

// Retrieve all cards used by an specific user id
router.get('/custom/userCards/:id', authenticatePassengerRol, getCardsByUser);

module.exports = router;
