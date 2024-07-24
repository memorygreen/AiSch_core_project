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