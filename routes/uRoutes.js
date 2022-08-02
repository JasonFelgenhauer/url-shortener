const express = require('express');
const router = express.Router();
const uController = require('../controllers/uController');

router.get('/', uController.index);

router.get('/why', uController.why);

router.get('/login', uController.login);

router.get('/register', uController.register);

router.post('/register', uController.registerPost);

module.exports = router;
