const express = require('express');
const userAuthController = require('../controllers/auth/user')
const router = express.Router();


router.post('/login', userAuthController.login);


module.exports = router;