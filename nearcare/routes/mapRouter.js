const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render('map', {
        KAKAO_API_KEY: process.env.KAKAO_API_KEY
    });
});


module.exports = router;