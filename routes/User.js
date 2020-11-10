const express = require('express');
const adminController = require('../controllers/Admin/AdminController')
const userController = require('../controllers/User/UserController');

const router = express.Router();

router.get('/all', adminController.getAllAdmins);

router.post('/supplier/addProduct', userController.addProduct);

module.exports = router;