const express = require('express');
const router = express.Router();
const uController = require('../controllers/uController');

router.get('/', uController.index);

router.get('/why', uController.why);

router.get('/login', uController.noAthentication, uController.login);

router.get('/register', uController.noAthentication, uController.register);

router.get('/logout', uController.needAuthentication, uController.logout);

router.get('/history', uController.needAuthentication, uController.history);

router.get('/delete/:id', uController.needAuthentication, uController.deleteLink);

router.get('/:id', uController.redirect);

router.post('/', uController.indexPost);

router.post('/register', uController.registerPost);

router.post('/login', uController.loginPost);

module.exports = router;
