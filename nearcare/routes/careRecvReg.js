const express = require('express');
const router = express.Router();
const conn = require('../config/db');
const moment = require('moment');
// const momentKo = require("moment/locale/ko");


router.get('/careRecvRegconfrm', (req, res)=>{
    let sql = 'select * from tb_user as u inner join tb_care_receiver as r where u.user_id = ? and r.user_id = ?';
    let user_id = 'user_id 30';
    conn.query(sql, [user_id , user_id], (err, rows)=>{
        // 날짜 데이터 변환
        let birthDay = moment(rows[0].receive_care_birth);
        let btd_set = birthDay.format('YYYY-MM-DD');
        let btd_split = btd_set.split('-');
        let btDay = btd_split[0]+'년 '+btd_split[1] + '월 ' + btd_split[2] + '일';

        res.render('careReceiverReg', {dbData : rows[0], date : btDay});
    });
});

router.get('/careRecvList', (req, res)=>{
    let sql = 'select receive_care_name, receive_care_birth, receive_care_gender, receive_care_phone, user_email, receive_care_level, receive_care_add from tb_user as u inner join tb_care_receiver as r where u.user_id = r.user_id';
    conn.query(sql, (err, rows)=>{
        let userArr = [];
        userArr = rows
        let arrDate = [];
        let birthDay = '';
        let btd_set = '';
        let btd_split = '';
        let btDay = '';
        let gender = '';
        for(let i = 0; i < userArr.length; i++){
            // 마스킹 처리 하기
            birthDay = moment(rows[i].receive_care_birth);
            btd_set = birthDay.format('YYYY-MM-DD');
            btd_split = btd_set.split('-');
            btDay = btd_split[0]+'년 '+btd_split[1] + '월 ' + btd_split[2] + '일';
            
            arrDate.push({
                userName : rows[i].receive_care_name,
                userBirth : btDay,
                gender : rows[i].receive_care_gender,
                phone : rows[i].receive_care_phone,
                careLevel : rows[i].receive_care_level,
                userAdd : rows[i].receive_care_add,
            });
            console.log('arrDate',arrDate);
        };
        // console.log('rows',rows);
        console.log('userarr',userArr.length);
        console.log('arrDate[0].userName', arrDate[0].userName);
        res.render('careRecvList',{arrDate});
        
    });
});

router.get('/careRecvDetail', (req, res)=>{
    res.render('careRecvDetail');
});

module.exports = router;