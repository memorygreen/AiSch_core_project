// 디비와 연결 정보를 관리하는 공간
const mysql = require('mysql2'); // 충돌우려 mysql2로 사용해보자

// DB연결정보 설정
const conn = mysql.createConnection({
    host: 'project-db-stu3.smhrd.com',
    port: 3307,
    user: 'Insa5_JSB_hacksim_2',
    password: 'aischool2',
    database: 'Insa5_JSB_hacksim_2'
});


// 연결진행
conn.connect();
console.log("DB연결");
module.exports = conn;

