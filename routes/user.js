const express = require('express');

const UserController = require('../controller/user');
const MessageController = require('../controller/message');
const authenticator = require('../middleware/auth')
const router = express.Router();

router.post('/signup', UserController.registerUser);

router.post('/login', UserController.loginUser);

router.post('/sendmessage/:id', authenticator.authenticate, MessageController.sendMessage);

router.get('/getmessage/:id', MessageController.getMessage);

module.exports = router;