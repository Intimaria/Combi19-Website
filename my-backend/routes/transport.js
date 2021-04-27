const {Router} = require('express');
const {
    getTransports,
    getTransportById,
    transportPut,
    postTransport,
    transportPatch,
    transportDelete
} = require('../controllers/transport');

const router = Router();


router.get('/', getTransports);

router.get('/:id', getTransportById);

router.post('/', postTransport);


module.exports = router;
