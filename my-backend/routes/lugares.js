const { Router } = require('express');

const { getLugares, postLugar, getLugarById, putLugar, deleteLugar } = require("../controllers/lugares");

const router = Router();

// Retrieve all lugares
router.get('/', getLugares);

// Create a new lugares
router.post('/', postLugar);

// Retrieve a single lugares with id
router.get('/:id', getLugarById);

// Update a lugares with id
router.put('/:id', putLugar);

// Delete a lugares with id
router.delete('/:id', deleteLugar);

module.exports = router;
