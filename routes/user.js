const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const routeController = require('../controllers/routeController');
const postController = require('../controllers/postController');

router.get('/', routeController.index);

router.get('/login', userController.noAthentication, routeController.login);

router.get('/register', userController.noAthentication, routeController.register);

router.get('/logout', userController.needAuthentication, routeController.logout);

router.get('/history', userController.needAuthentication, routeController.history);

router.get('/delete/:id', userController.needAuthentication, routeController.deleteLink);

router.get('/:id', routeController.redirect);

router.post('/', postController.indexPost);

router.post('/register', postController.registerPost);

router.post('/login', postController.loginPost);

module.exports = router;
