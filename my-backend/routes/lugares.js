const { Router } = require('express');

const { ListLugares, AddLugar, ModifyLugar, VerLugar, DeleteLugar } = require("../controllers/lugares");

const router = Router();

// Retrieve all lugares
router.get('/', ListLugares);

// Create a new lugares
router.post('/', AddLugar);

// Retrieve a single lugares with id
router.get('/:id', VerLugar);

// Update a lugares with id
router.put('/:id', ModifyLugar);

// Delete a lugares with id
router.delete('/:id', DeleteLugar);

module.exports = router;
