const { Router } = require('express');
const { transportGet,
    transportPut,
    transportPost,
    transportPatch,
    transportDelete } = require('../controllers/transport');

const router = Router();


router.get('/', transportGet);

router.post('/', transportPost);


module.exports = router;
