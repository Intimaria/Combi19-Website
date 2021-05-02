const {Router} = require('next/router');
const {
    getTransports,
    getTransportById,
    postTransport,
    putTransport,
    deleteTransport
} = require('../controllers/transports');

// The administrator role should be validated with a middleware before performing any operation
const {authenticateAdminRol} = require("../middlewares/authorization.js");

const router = Router();

// Retrieve all transports
router.get('/', authenticateAdminRol, getTransports);

// Retrieve a single transport by id
router.get('/:id', authenticateAdminRol, getTransportById);

// Create a new transport
router.post('/:id', authenticateAdminRol, postTransport);

// Update a transport by id
router.put('/:id', authenticateAdminRol, putTransport);

// Delete a transport by id
router.delete('/:id', authenticateAdminRol, deleteTransport);

module.exports = router;
