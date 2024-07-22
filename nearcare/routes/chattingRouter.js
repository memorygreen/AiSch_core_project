const express = require('express');
const router = express.Router();
const conn = require('../config/db');


router.get('/', (req,res)=>{
    res.render('chatting');
    
});

module.exports = router;