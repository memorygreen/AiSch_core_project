require('dotenv').config(); // dotenv를 가장 상단에 위치
const express = require('express');
const app = express();
const port = 3098;
const nunjucks = require('nunjucks');
const bp = require('body-parser');
const path = require('path');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const conn = require('./config/db'); // 데이터베이스 연결 모듈 추가

// 세션 파일 저장소 경로 설정
const sessionDir = path.join(__dirname, 'sessions');

app.use(session({
    httpOnly: true,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new fileStore({ path: sessionDir }),
    cookie: { 
        maxAge: 1000 * 60 * 60 // 1시간 유효
    }
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_REST_API_KEY,
    callbackURL: process.env.KAKAO_REDIRECT_URI
}, (accessToken, refreshToken, profile, done) => {
    console.log('Kakao Profile:', profile);
    console.log('Profile JSON:', profile._json);

    const userId = profile.id;
    const userName = profile.displayName;

    // Profile의 구조를 안전하게 탐색
    const userProperties = profile._json ? profile._json.properties : {};
    const userNickname = userProperties.nickname;

    if (!userNickname) {
        console.error('Nickname not found in Kakao profile');
        return done(new Error('User nickname is not available from Kakao profile'));
    }

    // 카카오 사용자 정보를 세션에 저장
    return done(null, { USER_ID: userId, USER_NAME: userNickname });
}));

app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    res.locals.userType = req.session.userType || null;
    next();
});

// 정적 파일요청 폴더 등록
app.use(express.static(path.join(__dirname, 'public')));
app.use(bp.json()); 
app.use(bp.urlencoded({ extended: true }));

// 라우터 등록
app.use('/', require('./routes/mainRouter'));
app.use('/careRecvReg', require('./routes/careRecvRegRouter'));
app.use('/chatting', require('./routes/chattingRouter'));
app.use('/matching', require('./routes/matchingRouter'));
app.use('/cs', require('./routes/csRouter'));
app.use('/user', require('./routes/userRouter'));
app.use('/map', require('./routes/mapRouter'));
app.use('/cal', require('./routes/calculatorRouter'));

// 넌적스 셋팅
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
