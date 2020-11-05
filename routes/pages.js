const express = require('express');

const router = express.Router();

router.get('/', (req, res)=>{
    res.render("index");
})
router.get('/admin', (req, res)=>{
    res.render("adminLogin");
})
router.get('/adminRegister', (req, res)=>{
    res.render("adminRegister");
})

module.exports = router;