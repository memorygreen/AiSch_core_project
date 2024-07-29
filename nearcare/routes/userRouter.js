const express = require('express');
const crypto = require('crypto');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const conn = require('../config/db');
const csrf = require('csurf');

const router = express.Router();

// CSRF 미들웨어 설정
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    }
});

// Passport 초기화
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// KakaoStrategy 설정
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_REST_API_KEY,
    callbackURL: process.env.KAKAO_REDIRECT_URI
}, (accessToken, refreshToken, profile, done) => {
    const userId = profile.id;
    const userName = profile.displayName;
    const userProperties = profile._json ? profile._json.properties : {};
    const userNickname = userProperties.nickname;

    if (!userNickname) {
        return done(new Error('User nickname is not available from Kakao profile'));
    }

    const sql = 'SELECT * FROM TB_USER_KAKAO WHERE USER_ID = ?';
    conn.query(sql, [userId], (err, results) => {
        if (err) {
            return done(err);
        }
        if (results.length === 0) {
            const sql = `INSERT INTO TB_USER_KAKAO (USER_ID, USER_NAME, USER_NICKNAME) VALUES (?, ?, ?)`;
            conn.query(sql, [userId, userName, userNickname], (err, results) => {
                if (err) {
                    return done(err);
                }
                return done(null, { USER_ID: userId, USER_NAME: userName, USER_NICKNAME: userNickname });
            });
        } else {
            return done(null, results[0]);
        }
    });
}));

// 회원가입 페이지
router.get('/join', csrfProtection, (req, res) => {
    const kakaoUser = req.session.kakaoUser || {};
    res.render('join', { kakaoUser, csrfToken: req.csrfToken() });
});

// 회원가입 처리
router.post('/join', csrfProtection, (req, res) => {
    const { userId, password, userName, userEmail, userPhone, userBirthdate, userCondition, userCenterCode, userCenterName, userCenterCate } = req.body;

    if (!password) {
        return res.status(400).send('Password is required');
    }

    try {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const joinedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const userType = userCenterCode ? 2 : 1;

        const sql = `INSERT INTO TB_USER 
            (USER_ID, USER_PW, USER_NAME, USER_EMAIL, USER_BIRTHDATE, USER_TYPE, USER_PHONE, USER_CONDITION, USER_CENTER_CODE, USER_JOINED_AT, USER_CENTER_NAME, USER_CENTER_CATE, USER_POINT) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            userId,
            hashedPassword,
            userName,
            userEmail,
            userBirthdate,
            userType,
            userPhone,
            userCondition || null,
            userCenterCode || null,
            joinedAt,
            userCenterName || null,
            userCenterCate || null,
            10000
        ];

        conn.query(sql, values, (err, results) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }

            delete req.session.kakaoUser;
            res.redirect('/user/joinsuccess');
        });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// 회원가입 성공 페이지
router.get('/joinsuccess', csrfProtection, (req, res) => {
    res.render('joinsuccess', { csrfToken: req.csrfToken() });
});

// 로그인 페이지
router.get('/login', csrfProtection, (req, res) => {//토큰 확인을 위한 csrfProtection 추가 - 아인
    res.render('login', { csrfToken: req.csrfToken() });// 토큰 발행을 위해 csrfToken: req.csrfToken() 추가 - 아인
});

// 로그인 처리
router.post('/loginPost', csrfProtection, (req, res) => {//토큰 확인을 위한 csrfProtection 추가 - 아인
    const { userId, userPw } = req.body;

    const hashedPassword = crypto.createHash('sha256').update(userPw).digest('hex');

    const sql = 'SELECT * FROM TB_USER WHERE USER_ID = ? AND USER_PW = ?';
    conn.query(sql, [userId, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        
        const user = results[0];
        req.session.userId = user.USER_ID;
        req.session.userType = user.USER_TYPE;
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            // user.js 에서 받는 부분 - 아인
            res.json({ success: true, message: 'Login successful' });
        });
        // 기존 진수씨 코드 - 멋대로 수정해서 죄송해요 ㅠㅠ - 아인
        // const user = results[0];
        // req.session.userId = user.USER_ID;
        // req.session.userType = user.USER_TYPE;
        // req.session.save((err) => {
        //     res.redirect('/'); 
        // });
    });
});


// 카카오 로그인 라우트
router.get('/auth/kakao', passport.authenticate('kakao'));

// 카카오 로그인 콜백 라우트
router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/user/login' }),
    (req, res) => {
        const user = req.user;

        if (user) {
            const sqlKakao = 'SELECT * FROM TB_USER_KAKAO WHERE USER_ID = ?';
            conn.query(sqlKakao, [user.USER_ID], (err, kakaoResults) => {
                if (err) {
                    return res.redirect('/user/login');
                }

                const sqlUser = `
                    SELECT u.*
                    FROM TB_USER u
                    JOIN TB_USER_KAKAO k ON u.USER_ID = k.USER_ID
                    WHERE k.USER_ID = ?`;

                conn.query(sqlUser, [user.USER_ID], (err, userResults) => {
                    if (err) {
                        return res.redirect('/user/login');
                    }

                    if (userResults.length > 0) {
                        const user = userResults[0];
                        req.session.userId = user.USER_ID;
                        req.session.userType = user.USER_TYPE;
                        req.session.save((err) => {
                            res.redirect('/');
                        });
                    } else {
                        req.session.kakaoUser = {
                            userId: user.USER_ID,
                            userName: user.USER_NAME
                        };
                        const kakaoUser = req.session.kakaoUser || {};
                        res.render('join', { kakaoUser, csrfToken: req.csrfToken() });
                    }
                });
            });
        } else {
            res.redirect('/user/login');
        }
    }
);

// 로그아웃 처리
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/');
        });
    });
});

module.exports = router;
