// 1등급 월 한도액 2069900
// 2등급 월 한도액 1869600
// 3등급 월 한도액 1455800
// 4등급 월 한도액 1341800
// 5등급 월 한도액 1151600

// 30분 16630
// 60분 24120
// 90분 32510
// 120분 41380
// 150분 48250
// 180분 54320
// 210분 60530
// 240분 66770
const express = require('express');
const router = express.Router();

// 기본 방문요양 지원금 계산기 페이지
router.get('/', (req, res) => {
    res.render('calculator');
});

module.exports = router;