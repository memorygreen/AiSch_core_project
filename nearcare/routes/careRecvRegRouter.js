const express = require('express');
const router = express.Router();
const conn = require('../config/db');
const moment = require('moment');
// const momentKo = require("moment/locale/ko");

//body-parser등록

router.get('/careRecvRegconfrm', (req, res) => {
    let sql = 'select * from tb_user as u inner join tb_care_receiver as r where u.user_id = ? and r.user_id = ?';
    let user_id = 'user_id 30';
    conn.query(sql, [user_id, user_id], (err, rows) => {
        // 날짜 데이터 변환
        let birthDay = moment(rows[0].receive_care_birth);
        let btd_set = birthDay.format('YYYY-MM-DD');
        let btd_split = btd_set.split('-');
        let btDay = btd_split[0] + '년 ' + btd_split[1] + '월 ' + btd_split[2] + '일';

        res.render('careReceiverReg', { dbData: rows[0], date: btDay });
    });
});

router.get('/careRecvList', (req, res) => {
    let sql = 'select receive_care_name, receive_care_birth, receive_care_gender, receive_care_phone, user_email, receive_care_level, receive_care_add from tb_user as u inner join tb_care_receiver as r where u.user_id = r.user_id';
    conn.query(sql, (err, rows) => {
        let userArr = [];
        userArr = rows
        let arrDate = [];
        let birthDay = '';
        let btd_set = '';
        let btd_split = '';
        let btDay = '';
        let gender = '';
        for (let i = 0; i < userArr.length; i++) {
            // 마스킹 처리 하기
            birthDay = moment(rows[i].receive_care_birth);
            btd_set = birthDay.format('YYYY-MM-DD');
            btd_split = btd_set.split('-');
            btDay = btd_split[0] + '년 ' + btd_split[1] + '월 ' + btd_split[2] + '일';

            arrDate.push({
                userName: rows[i].receive_care_name,
                userBirth: btDay,
                gender: rows[i].receive_care_gender,
                phone: rows[i].receive_care_phone,
                careLevel: rows[i].receive_care_level,
                userAdd: rows[i].receive_care_add,
            });
            // console.log('arrDate',arrDate);
        };
        // console.log('rows',rows);
        // console.log('userarr',userArr.length);
        // console.log('arrDate[0].userName', arrDate[0].userName);
        res.render('careRecvList', { arrDate });

    });
});

router.get('/careRecvDetail', (req, res) => {
    console.log("detail_request", req.params.id);
    let careReceiverId = req.params.id;
    let sql = 'SELECT CARE_RECEIVER_NAME, CARE_RECEIVER_BIRTH, CARE_RECEIVER_GENDER, CARE_RECEIVER_LEVEL, CARE_RECEIVER_PHONE, CARE_RECEIVER_ADD, CARE_RECEIVER_PAY, CARE_RECEIVER_DAYS, CARE_RECEIVER_DEMENTIA, CARE_RECEIVER, CARE_RECEIVER_BEHAVIOR, CARE_RECEIVER_DIALYSIS, CARE_RECEIVER_ETC FROM TB_CARE_RECEIVER WHERE CARE_RECEIVER_ID=1';


    conn.query(sql, (err, rows) => {
        let userArr = [];
        console.log("select한 detail 데이터", rows[0]);

        let gender ='';
        if(rows[0].CARE_RECEIVER_GENDER == 'M'){
            gender='남자';
        }else{
            gender='여자';
        }

        let birthDay = moment(rows[0].CARE_RECEIVER_BIRTH);
        btd_set = birthDay.format('YYYY-MM-DD');
        btd_split = btd_set.split('-');
        btDay = btd_split[0] + '년 ' + btd_split[1] + '월 ' + btd_split[2] + '일';
        console.log('birthday', btDay);

        let dementia ='';
        let meal = '';
        let behavior = '';
        let dialysis = '';
        if(rows[0].CARE_RECEIVER_DEMENTIA == 'N'){
            dementia = 'invisible';
        }else{
            dementia = 'visible';
        }

        if(rows[0].CARE_RECEIVER == 'N'){
            meal = 'invisible';
        }else{
            meal = 'visible';
        }

        if(rows[0].CARE_RECEIVER_BEHAVIOR == 'N'){
            behavior = 'invisible';
        }else{
            behavior = 'visible';
        }

        if(rows[0].CARE_RECEIVER_DIALYSIS == 'N'){
            dialysis = 'invisible';
        }else{
            dialysis = 'visible';
        }

        

        res.render('careRecvDetail', { data: rows[0],gender:gender, birthDay: btDay, dementia:dementia, meal:meal, behavior:behavior, dialysis:dialysis });

    })



});

module.exports = router;