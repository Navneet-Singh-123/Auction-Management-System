const express = require('express');
const adminController = require('../controllers/Admin/AdminController')

const router = express.Router();

router.get('/all', adminController.getAllAdmins);

module.exports = router;