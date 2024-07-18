const express = require('express');
const app = express();
const mainRouter = require('./routes/mainRouter');
const nunjucks = require('nunjucks');
const path = require('path');

// public 파일
app.use(express.static(path.join(__dirname, 'public')));

// 라우터
app.use('/', mainRouter);

// nunjucks
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true
});

app.listen(3000)
