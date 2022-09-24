const express = require('express');

const UserController = require('../controller/user');
const MessageController = require('../controller/message');
const router = express.Router();

router.post('/signup', UserController.registerUser);

router.post('/login', UserController.loginUser);

router.post('/sendmessage', MessageController.sendMessage);

router.get('/getmessage', MessageController.getMessage);

module.exports = router;