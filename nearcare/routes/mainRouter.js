const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF 미들웨어 설정 - 아인
const csrfProtection = csrf({ 
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    }
});
router.get('/', (req, res) => {
    res.render('main', { csrfToken: req.csrfToken()
    });//토큰 전달을 위해 코드 추가 - 아인
});

module.exports = router;
