const express = require('express');
const adminAuthController = require('../controllers/auth/admin')
const router = express.Router();

router.post('/register', adminAuthController.register)

module.exports = router;