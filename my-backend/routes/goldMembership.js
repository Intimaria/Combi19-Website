const {Router} = require('express');

const {putGoldMembership} = require('../controllers/goldMembership');

const {authenticatePassengerRol} = require('../middlewares/authorization');

const router = Router();

// Update a gold membership by id
router.put('/:id', authenticatePassengerRol, putGoldMembership);

module.exports = router;
