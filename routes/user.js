const express = require('express');

const UserController = require('../controller/user');
const router = express.Router();

router.post('/signup', UserController.registerUser);

router.post('/login', UserController.loginUser);

router.post('/sendmessage', UserController.sendmessage);

router.get('/getmessage', UserController.getmessage);

module.exports = router;