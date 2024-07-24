const express = require('express');
const router = express.Router();
const conn = require('../config/db');
const moment = require('moment');
const maskDatas = require('../public/js/careRecvModule');
const sqlModule = require('../public/js/careRecvSqlModule');
const formetDate = require('../public/js/formatDate');
// const momentKo = require("moment/locale/ko");

// 요양정보등록 라우터
router.get('/careRecvRegconfrm', (req, res)=>{
    // let sql = 'snpmSER_ID = "?"and r.USER_ID = "?" ';
    let sql = sqlModule.careRecvRegconfrm();
    // sql 임시 정보 불러오기 위해 id 지정
    // 추후 선택한 대상자 정보 불러와 넣을 예정-아인
    // let user_id = 'user001';
    conn.query(sql,  (err, rows)=>{
        // 날짜 데이터 변환
        // let birthDay = moment(rows[0].care_receiver_birth);
        // let btd_set = birthDay.format('YYYY-MM-DD');
        // let btd_split = btd_set.split('-');
        // let btDay = btd_split[0]+'년 '+btd_split[1] + '월 ' + btd_split[2] + '일';
        let birthDay = rows[0].care_receiver_birth;
        let btDay = formetDate(birthDay);
        res.render('careReceiverReg', {dbData : rows[0], btDay : btDay});
    });
});

// 요양 대상자 리스트 조회해와 마스킹 처리
router.get('/careRecvList', (req, res)=>{

    let sql = sqlModule.careRecvListSql();
    
    conn.query(sql, (err, rows)=>{
        // 마스킹 처리 함수
        let arrData = maskDatas(rows);
        // console.log('arrData : ', arrData[0].gender);
        // 요양대상자 리스트 페이지 이동
        res.render('careRecvList', {arrData});
    });
});

// 요양 대상자 상세 정보 페이지 이동
router.get('/careRecvDetail', (req, res)=>{
    res.render('careRecvDetail');
});



module.exports = router;