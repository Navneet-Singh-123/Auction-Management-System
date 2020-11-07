const express = require('express');
const adminAuthController = require('../controllers/auth/admin')
const router = express.Router();

router.post('/register', adminAuthController.register)

router.post('/login', adminAuthController.login);

router.get('/logout', adminAuthController.logout);

module.exports = router;