const express = require('express');

const UserController = require('../controller/user');
const router = express.Router();

router.post('/signup', UserController.registerUser);

module.exports = router;