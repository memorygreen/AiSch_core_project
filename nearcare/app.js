require('dotenv').config(); // dotenv를 가장 상단에 위치
const express = require('express');
const app = express();
const port = 3098;
const nunjucks = require('nunjucks');
const bp = require('body-parser');
const mainRouter = require('./routes/mainRouter');
const careRecvRegRouter = require('./routes/careRecvRegRouter');
const chattingRouter = require('./routes/chattingRouter');
const matchingRouter = require('./routes/matchingRouter');
const csRouter = require('./routes/csRouter');
const userRouter = require('./routes/userRouter');
const path = require('path');
const fs = require('fs');
const mapRouter = require('./routes/mapRouter');

const session = require('express-session');
const fileStore = require('session-file-store')(session);

// 세션 파일 저장소 경로 설정
const sessionDir = path.join(__dirname, 'sessions');

app.use(session({
    httpOnly: true,
    resave: false,
    saveUninitialized: true,
    secret: 'secret',
    store: new fileStore({ path: sessionDir }),
    cookie: { 
        maxAge: 1000 * 60 * 60 // 1시간 유효
    }
}));

app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    res.locals.userType = req.session.userType || null;
    next();
});


// 세션 데이터를 모든 템플릿에 전달하는 미들웨어
app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    res.locals.userType = req.session.userType || null;
    next();
});
// 정적 파일요청 폴더 등록
app.use(express.static(path.join(__dirname, 'public')));
app.use(bp.json()); // JSON 데이터 처리 등록, open ai api 사용 시 필요

// post 데이터 처리 등록
app.use(bp.urlencoded({ extended: true }));

// 라우터 등록
app.use('/', mainRouter);
app.use('/careRecvReg', careRecvRegRouter);
app.use('/chatting', chattingRouter);
app.use('/matching', matchingRouter);
app.use('/cs', csRouter);
app.use('/user', userRouter);
app.use('/map', mapRouter);

// 넌적스 셋팅
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
