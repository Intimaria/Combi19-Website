const {Router} = require('express');

const {postGoldMembership, putGoldMembership} = require('../controllers/goldMembership');

const {authenticatePassengerRol} = require('../middlewares/authorization');

const router = Router();

// Create a new gold membership
router.post('/', authenticatePassengerRol, postGoldMembership);

// Update a gold membership by id
router.put('/:id', authenticatePassengerRol, putGoldMembership);

module.exports = router;
