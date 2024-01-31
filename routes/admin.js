const express = require('express')
const router = express.Router();

const adminController = require('../controller/admin')

router.post('/adduser/:id',adminController.addUser)
router.post('/removeuser/:id',adminController.removeUser)
router.post('/makeadmin/:id',adminController.makeAdmin)
router.post('/removeadmin/:id',adminController.removeAdmin)

module.exports = router;