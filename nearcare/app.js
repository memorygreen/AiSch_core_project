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
const path = require('path');

const session = require('express-session');
const fileStore = require('session-file-store')(session);
// 세션 설정
app.use(session({
    httpOnly : true, // http로 들어온 요청만 처리
    resave : false, // 세션을 항상 재 저장할 건지 
    secret : 'secret', // 암호화할 때 사용하는 키값 
    store : new fileStore(), // 세션을 저장하기 위한 저장소 셋팅
    saveUninitialized : false // 기본값은 true 세션에 저장할 내용이 없더라도 저장할 것인지
}));

// 정적 파일요청 폴더 등록
app.use(express.static(path.join(__dirname, 'public')));
app.use(bp.json()); // JSON 데이터 처리 등록, open ai api 사용 시 필요

// post 데이터 처리 등록
app.use(bp.urlencoded({extended : true}));

// 메인 라우터 등록
app.use('/', mainRouter);
app.use('/careRecvReg', careRecvRegRouter);
app.use('/chatting', chattingRouter);
app.use('/matching', matchingRouter);
app.use('/cs', csRouter);


// 넌적스 셋팅
app.set('view engine', 'html');
nunjucks.configure('views', {
    express : app,
    watch : true
});

app.listen(port);