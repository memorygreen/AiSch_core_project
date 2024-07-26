const express = require('express');
const router = express.Router();
const conn = require('../config/db');
const recvModule = require('../public/js/careRecvModule');
const sqlModule = require('../public/js/careRecvSqlModule');
const formetDate = require('../public/js/formatDate');


// 요양정보등록 라우터
router.get('/careRecvRegconfrm', (req, res) => {
    let sql = sqlModule.careRecvRegconfrm();
    // 추후 선택한 대상자 정보 불러와 넣을 예정-아인
    conn.query(sql, (err, rows) => {
        if (err) {
            console.error('careRecvRegconfrm 에러');
        }
        let birthDay = rows[0].CARE_RECEIVER_BIRTH;
        let birthDayFormet = formetDate(birthDay);
        res.render('careReceiverReg', { dbData: rows[0], birthDayFormet: birthDayFormet });
    });

});

// 요양 대상자 리스트 조회해와 마스킹 처리
router.get('/careRecvList', (req, res) => {
    let userId2 = req.session.userId;
    console.log('userId2', userId2);

    let sql = sqlModule.careRecvListSql();

    
    conn.query(sql, (err, rows) => {
        if (err) {
            console.error('careRecvList 에러');
            return res.status(500).send('데이터베이스 조회 중 에러가 발생했습니다.');
        }
        // 마스킹 처리 함수
        let arrData = recvModule.maskDatas(rows);
        // 임시 포인트 조회를 위해 테스트 데이터 넣음 - 아인
        let point = rows[2].user_point;
        // 요양대상자 리스트 페이지 이동
        res.render('careRecvList', { arrData, point });

    });
    //추후 로그인한 정보불러와 넣을 예정 - 아인
    // res.json({ success: true});
    // let userId = req.body.userId;
    // console.log('userId', userId);
});


// 요양 대상자 상세 정보 페이지 이동
router.get('/careRecvDetail', (req, res) => {
    // 선택한 대상정보를 저장한 세션에서 대상 아이디를 불러와 변수에 할당
    const selUserId = req.session.selectedUserId;
    console.log('selUserId',selUserId);
    console.log('selUserId typeof',typeof(selUserId));
    //sql문 작성하는 함수
    const selUserInfSql = sqlModule.careRecviInfo(selUserId);
    // db실행
    console.log('selUserInfSql',selUserInfSql);
    conn.query(selUserInfSql, (err, rows) => {
        if (err) {
            console.error('selUserInfSql 에러났어..',err);
            conn.end();
        };
        console.log('rows', rows);
        // DB에서 넘어온 데이터를 userInfo()함수에 넣어 정제해서 userData에 할당
        let userData = recvModule.userInfo(rows);

        // 정제된 userData를 careRecvDetail 페이지에 넘겨줌
        res.render('careRecvDetail', { userData });
        // const {userInfo} = rows[0];
    });
});

// 상세보기 누른 회원의 아이디 정보를 불러와 세션에 저장
router.post('/setSelectedUid', (req, res) => {
    const { selectedUserId } = req.body;
    req.session.selectedUserId = selectedUserId;
    res.send({ success: true });
});

// 모달창에서 확인 버튼 클릭 -> 결제할 포인트 조회
router.post('/selPoint', (req, res) => {
    // 클라이언트로부터 전달된 데이터 확인
    let userId = req.session.userId;//기관 아이디
    console.log('기관id:', userId);

    // 포인트 결제 sql
    let selectPointSql = sqlModule.selectPoint(userId);
    // 조회 포인트 지정
    // let pointsToDeduct = 500;
    // 포인트 조회
    conn.query(selectPointSql, (err, results) => {
        const currentPoints = results[0].USER_POINT;
        // console.log(typeof(currentPoints));
        if (err) {
            console.error('포인트 조회 에러');
            if (!res.headersSent) {
                return res.status(500).json({ success: false, message: '포인트 조회 실패' });
            };
        };
        // 조회해온 회원 포인트
        req.session.userPoint = currentPoints;
        res.json({ success: true, userPoint: currentPoints });
    });
    
});

// 결제
router.post('/pay', (req, res) => {
    // 세션에 저장된 회원 포인트를 가져옴
    let userPoint = req.session.userPoint;
    // 로그인한 유저 (test로 넣어둠- careRecvList 부분 하단에 있음) 아인
    var userId = req.session.userId;

    // updateSql
    const currentPointsSql = sqlModule.updateUserPointSql(userPoint, userId);

    conn.beginTransaction((err) => {
        if (err) {
            return res.status(500).send('시작부터 장난...');
        };
        // 포인트 차감 쿼리
        conn.query(currentPointsSql, (err) => {
            if (err) {
                return conn.rollback(() => {
                    console.error('포인트 차감 에러', err);
                    conn.end();
                });
            };
            // 성공하면 커밋
            conn.commit((err) => {
                if (err) {
                    return conn.rollback(() => {
                        console.error('커밋 에러', err);
                        conn.end();
                    });
                };
                console.log('커밋 완료!');
                //Error: Can't add new command when connection is in closed state 에러 발생 커밋후  DB를 닫자마자 아래 조회 쿼리를 실행하려고해서 발생됨 아래 코드는 주석처리함
                // conn.end();
            });
            // 커밋 후 잔여 포인트 안내를 위해 다시 조회
            let selectPointSql = sqlModule.selectPoint(userId);
            conn.query(selectPointSql, (err, results) => {
                if (err) {
                    console.error('커밋 후 조회 실패!!');
                    conn.end();
                };
                // 차감 후 저장된 포인트
                const reUserPoint = results[0].USER_POINT;
                // 세션에 담아줌
                req.session.userPoint = reUserPoint;
                res.json({ success: true, reUserPoint: reUserPoint });
            });
        });
    });
    
});


module.exports = router;