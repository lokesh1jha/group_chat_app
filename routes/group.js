const express = require('express')


const Conversation = require('../controller/group');
const authenticator = require('../middleware/auth');

const router = express.Router();

router.post('/creategroup', authenticator.authenticate, Conversation.createGroup);
router.get('/fetchGroup', authenticator.authenticate, Conversation.fetchGroup);
router.get('/getmembers/:id', authenticator.authenticate, Conversation.getGroupUser);

module.exports = router;