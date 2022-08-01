const express = require('express');
const router = express.Router();
const uController = require('../controllers/uController');

router.get('/', uController.index);

router.get('/why', uController.why);

module.exports = router;
