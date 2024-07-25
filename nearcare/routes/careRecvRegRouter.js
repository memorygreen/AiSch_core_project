const express = require('express');
const router = express.Router();
const conn = require('../config/db');
const moment = require('moment');
const recvModule = require('../public/js/careRecvModule');
const sqlModule = require('../public/js/careRecvSqlModule');
const formetDate = require('../public/js/formatDate');

// const momentKo = require("moment/locale/ko");
// router.get('/', (req, res)=>{
//     req.session.userId = 'user010';// test
//     res.render('index');
// });

// 요양정보등록 라우터
router.get('/careRecvRegconfrm', (req, res)=>{
    // let sql = 'snpmSER_ID = "?"and r.USER_ID = "?" ';
    let sql = sqlModule.careRecvRegconfrm();
    // sql 임시 정보 불러오기 위해 id 지정
    // 추후 선택한 대상자 정보 불러와 넣을 예정-아인
    // let user_id = 'user001';
    // req.session.userId = 'user010';
    // res.json({ success: true, message: '로그인 성공!' });
    // let userId = req.body.userId;
    // console.log('userId',userId);
    conn.query(sql,  (err, rows)=>{
        if(err){
            console.error('careRecvRegconfrm 에러');
        }
        let birthDay = rows[0].CARE_RECEIVER_BIRTH;
        let birthDayFormet = formetDate(birthDay);
        res.render('careReceiverReg', {dbData : rows[0], birthDayFormet : birthDayFormet});
    });
    
});

// 요양 대상자 리스트 조회해와 마스킹 처리
router.get('/careRecvList', (req, res)=>{
    let sql = sqlModule.careRecvListSql();
    
    conn.query(sql, (err, rows)=>{
        if(err){
            console.error('careRecvList 에러');
        }
        // console.log('요양대상자들 데이터', rows);
        // 마스킹 처리 함수
        let arrData = recvModule.maskDatas(rows);
        // 임시 포인트 조회를 위해 테스트 데이터 넣음 - 아인
        let point = rows[2].user_point;
        // 요양대상자 리스트 페이지 이동
        res.render('careRecvList', {arrData, point});
    });
    req.session.userId = 'user010';
    // res.json({ success: true});
    let userId = req.body.userId;
    console.log('userId',userId);
});

// 모달창에서 확인 버튼 클릭 -> 결제할 포인트 조회
router.post('/selPoint',(req, res)=>{
    // 세션에 저장된 회원 아이디 가지고와서 추후 변경 예정 - 아인 ㅜㅜ
    // 클라이언트로부터 전달된 데이터 확인
    let userId = req.session.userId;
    console.log('Selected user:', userId);
    
    // 포인트 결제
    let selectPointSql = sqlModule.selectPoint(userId);
        let pointsToDeduct = 500;
        // 포인트 조회
    conn.query(selectPointSql, (err, results) =>{
        if(err){
            console.error('포인트 조회 에러');
            if(!res.headersSent){
                return res.status(500).json({success : false, message:'포인트 조회 실패'});
            };
        };
        // 현재 포인트
        console.log('results',results);
        const currentPoints = results[0].USER_POINT;
        console.log('currentPoints',currentPoints);
        if(currentPoints < pointsToDeduct){
            if(!res.headersSent){
                return res.status(400).json({success: false, message: '포인트 부족'});
            };
        };
        req.session.userPoint = currentPoints;
        res.json({ success : true, userPoint : currentPoints});
    });
});

router.post('/pay', (req, res)=>{
    let userPoint = req.session.userPoint;
    console.log('userPoint', userPoint);
    var userId = req.session.userId;
    console.log('userId', userId);

    // updateSql
    const currentPointsSql = sqlModule.updateUserPointSql(userPoint,userId);
    conn.beginTransaction((err)=>{
        if(err){
            return res.status(500).send('시작부터 장난...');
        };
        // 포인트 차감
        conn.query(currentPointsSql, (err) =>{
            if(err){
                return conn.rollback(()=>{
                    console.error('포인트 차감 에러',err);
                    conn.end();
                });
            };
            conn.commit((err)=>{
                if(err){
                    return conn.rollback(()=>{
                        console.error('커밋 에러', err);
                        conn.end();
                    });
                };
                console.log('커밋 완료!');
                conn.end();
            });
            console.log('커밋후 다시 조회 시 userId', userId);
            let selectPointSql = sqlModule.selectPoint(userId);
            conn.query(selectPointSql, (err, results)=>{
                if(err){
                    // return ;
                    console.error('커밋 후 조회 실패!!');
                    conn.end();
                };
                console.log('results',results);
                const reUserPoint = results[0].USER_POINT;
                req.session.userPoint = reUserPoint;
                res.json({ success : true, reUserPoint : reUserPoint});
            });
        });
    });
});

router.get('/careRecvDetail', (req, res) => {
    console.log("detail_request", req.params.id);
    let careReceiverId = req.params.id;
    let sql = 'SELECT CARE_RECEIVER_NAME, CARE_RECEIVER_BIRTH, CARE_RECEIVER_GENDER, CARE_RECEIVER_LEVEL, CARE_RECEIVER_PHONE, CARE_RECEIVER_ADD, CARE_RECEIVER_PAY, CARE_RECEIVER_DAYS, CARE_RECEIVER_DEMENTIA, CARE_RECEIVER, CARE_RECEIVER_BEHAVIOR, CARE_RECEIVER_DIALYSIS, CARE_RECEIVER_ETC FROM TB_CARE_RECEIVER WHERE CARE_RECEIVER_ID=1';


    conn.query(sql, (err, rows) => {
        let userArr = [];

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