const {Router} = require('express');
const {
    getTransports,
    getTransportById,
    getTransportDependenceById,
    postTransport,
    putTransport,
    deleteTransport,
    getActiveTransports
} = require('../controllers/transports');

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all transports
router.get('/', authenticateAdminRol, getTransports);

// Retrieve a single transport by id
router.get('/:id', authenticateAdminRol, getTransportById);

// Retrieve all actives transports
router.get('/custom/actives', authenticateAdminRol, getActiveTransports);

// Retrieve transport dependence by id
router.get('/custom/transportDependenceById/:id', authenticateAdminRol, getTransportDependenceById);

// Create a new transport
router.post('/', authenticateAdminRol, postTransport);

// Update a transport by id
router.put('/:id', authenticateAdminRol, putTransport);

// Delete a transport by id
router.delete('/:id', authenticateAdminRol, deleteTransport);

module.exports = router;
