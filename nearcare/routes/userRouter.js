const express = require('express');
const crypto = require('crypto');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const conn = require('../config/db');

const router = express.Router();



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
    // profile 정보를 확인
    console.log('Kakao Profile:', profile);
    console.log('Profile JSON:', profile._json);

    const userId = profile.id; // Kakao ID
    const userName = profile.displayName; // 사용자 이름

    // Profile의 구조를 안전하게 탐색
    const userProperties = profile._json ? profile._json.properties : {};
    const userNickname = userProperties.nickname;

    if (!userNickname) {
        console.error('Nickname not found in Kakao profile');
        return done(new Error('User nickname is not available from Kakao profile'));
    }

    // 데이터베이스에서 사용자 정보 확인
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
router.get('/join', (req, res) => {
    const kakaoUser = req.session.kakaoUser || {};
    console.log('Join Page Kakao User:', kakaoUser);
    res.render('join', { kakaoUser });
});

// 회원가입 처리
router.post('/join', (req, res) => {
    const { userId, password, userName, userEmail, userPhone, userBirthdate, userCondition, userCenterCode, userCenterName, userCenterCate } = req.body;

    if (!password) {
        return res.status(400).send('Password is required');
    }

    try {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const joinedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const userType = userCenterCode ? 2 : 1;

        // 기존 사용자 테이블에 정보 저장
        const sql = `INSERT INTO TB_USER 
            (USER_ID, USER_PW, USER_NAME, USER_EMAIL, USER_BIRTHDATE, USER_TYPE, USER_PHONE, USER_CONDITION, USER_CENTER_CODE, USER_JOINED_AT, USER_CENTER_NAME, USER_CENTER_CATE, USER_POINT) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            userId,
            hashedPassword, // USER_PW에 값이 제대로 할당되고 있음
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
            10000 // 기본 포인트
        ];

        conn.query(sql, values, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Internal Server Error');
            }

            delete req.session.kakaoUser;
            res.redirect('/user/joinsuccess');
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
    const { userId, userPw } = req.body;

    const hashedPassword = crypto.createHash('sha256').update(userPw).digest('hex');

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
        req.session.userId = user.USER_ID;
        req.session.userType = user.USER_TYPE;
        req.session.save((err) => {
            res.redirect('/'); 
        });
    });
});

// 카카오 로그인 라우트
router.get('/auth/kakao', passport.authenticate('kakao'));

// 카카오 로그인 콜백 라우트
router.get('/auth/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/user/login' }),
    (req, res) => {
        const user = req.user;
        console.log('Kakao user profile:', user);

        // 인증 코드 출력
        const authCode = req.query.code;
        console.log('Received auth code:', authCode);

        if (user) {
            // 카카오 테이블에서 사용자 정보를 가져옴
            const sqlKakao = 'SELECT * FROM TB_USER_KAKAO WHERE USER_ID = ?';
            conn.query(sqlKakao, [user.USER_ID], (err, kakaoResults) => {
                if (err) {
                    console.error('Database query error:', err);
                    return res.redirect('/user/login');
                }

                // TB_USER와 TB_USER_KAKAO 조인하여 로그인 처리
                const sqlUser = `
                    SELECT u.*
                    FROM TB_USER u
                    JOIN TB_USER_KAKAO k ON u.USER_ID = k.USER_ID
                    WHERE k.USER_ID = ?`;

                conn.query(sqlUser, [user.USER_ID], (err, userResults) => {
                    if (err) {
                        console.error('Database query error:', err);
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
                        console.log('Session Kakao User:', req.session.kakaoUser);
                        const kakaoUser = req.session.kakaoUser || {};
                        res.render('join', { kakaoUser });
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
            console.error('Error during logout:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
    });
});

module.exports = router;
