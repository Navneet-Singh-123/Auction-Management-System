const express = require('express');
const userAuthController = require('../controllers/auth/user')
const router = express.Router();


router.post('/login', userAuthController.login);

router.post('/supplier/register', userAuthController.registerSupplier);


module.exports = router;