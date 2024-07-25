const express = require("express");
const router = express.Router();
const conn = require("../config/db");
const crypto = require('crypto');

// 회원가입 페이지
router.get('/join', (req, res) => {
    res.render('join');
});

// 회원가입 처리
router.post('/join', (req, res) => {
    const { userId, password, userName, userEmail, userPhone, userBirthdate, userCondition, userCenterCode, userCenterName, userCenterCate } = req.body;
    
    try {
        // 비밀번호 암호화 (SHA-256)
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // 현재 시간 (TIMESTAMP)
        const joinedAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS' 형식

        // USER_TYPE 설정
        const userType = userCenterCode ? 2 : 1; // 기관 코드가 있을 경우 2, 없을 경우 1

        // 사용자 정보 저장
        const sql = `INSERT INTO TB_USER 
            (USER_ID, USER_PW, USER_NAME, USER_BIRTHDATE, USER_TYPE, USER_EMAIL, USER_PHONE, USER_CONDITION, USER_CENTER_CODE, USER_JOINED_AT, USER_CENTER_NAME, USER_CENTER_CATE, USER_POINT) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            userId,
            hashedPassword,
            userName,
            userBirthdate,
            userType,
            userEmail,
            userPhone,
            userCondition || null, 
            userCenterCode || null, 
            joinedAt,
            userCenterName || null, 
            userCenterCate || null, 
            10000 // 기본 포인트
        ];

        conn.query(sql, values, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.redirect('/user/joinsuccess'); // 회원가입 성공 후 페이지로 이동
        });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).send('Internal Server Error');
    }
});

// 회원가입 성공 페이지
router.get('/joinsuccess', (req, res) => {
    res.render('joinsuccess');
});

// 로그인 페이지
router.get('/login', (req, res) => {
    res.render('login');
});

// 로그인 처리
router.post('/login', (req, res) => {
    const { userId, userPw } = req.body; // `userPw`로 수정

    // 비밀번호 암호화 (SHA-256)
    const hashedPassword = crypto.createHash('sha256').update(userPw).digest('hex');

    // 사용자 정보 조회
    const sql = 'SELECT * FROM TB_USER WHERE USER_ID = ? AND USER_PW = ?';
    conn.query(sql, [userId, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];
        
        // 로그인 성공, 세션 저장
        req.session.userId = user.USER_ID;
        res.redirect('/'); // 로그인 후 메인 페이지로 이동
    });
});

module.exports = router;
