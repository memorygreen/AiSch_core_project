const express = require("express");
const router = express.Router();
const conn = require("../config/db");
const formatDate = require("../public/js/formatDate");
const sqlModule = require("../public/js/careRecvSqlModule");
const recvModule = require("../public/js/careRecvModule");

// 상세보기 버튼을 클릭한 후 선택한 사람의 ID를 세션에 저장
router.post('/setSelectedUid', (req, res) => {
    const { selectedUserId } = req.body;
    req.session.selectedUserId = selectedUserId;
    console.log('Session saved selectedUserId:', req.session.selectedUserId);  // 디버깅용 로그 추가
    req.session.save(() => {
        res.redirect('/careRecvReg/careRecvDetail');
    });
});

// 매칭페이지 기본
router.get("/", (req, res) => {
    const userId = req.session.userId;

    // userId가 없는 경우 로그인 페이지로 리다이렉트
    if (!userId) {
        return res.redirect('/user/login');
    }

    let sql = "SELECT B.CARE_RECEIVER_NAME, A.MATCH_IDX, A.USER_ID, A.CARE_RECEIVER_ID, A.MATCH_MATCHED_AT, A.MATCH_STATUS FROM TB_MATCHING AS A JOIN TB_CARE_RECEIVER AS B ON A.CARE_RECEIVER_ID = B.CARE_RECEIVER_ID WHERE A.USER_ID = ?";
    conn.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        let arr = [];

        rows.forEach(row => {
            arr.push({
                careReceiverName: row.CARE_RECEIVER_NAME,
                matchIdx: row.MATCH_IDX,
                userId: row.USER_ID,
                careReceiverId: row.CARE_RECEIVER_ID,
                matchMatchedAt: formatDate(row.MATCH_MATCHED_AT),
                matchStatus: row.MATCH_STATUS,
            });
        });

        console.log(arr);
        res.render('matching', { arr });
    });
});

// 요양 대상자 상세 정보 페이지 이동
router.get('/careRecvDetail', (req, res) => {
    const selUserId = req.session.selectedUserId;
    console.log('Session retrieved selectedUserId:', selUserId);  // 디버깅용 로그 추가

    if (!selUserId) {
        return res.redirect('/matching');
    }

    //sql문 작성하는 함수
    const selUserInfSql = sqlModule.careRecviInfo(selUserId);
    // db실행
    conn.query(selUserInfSql, (err, rows) => {
        if (err) {
            console.error('selUserInfSql 에러났어..', err);
            return res.status(500).send('Internal Server Error');
        }

        if (rows.length === 0) {
            return res.status(404).send('No data found for the selected user');
        }

        // DB에서 넘어온 데이터를 userInfo()함수에 넣어 정제해서 userData에 할당
        let userData = recvModule.userInfo(rows);
        const styles = {
            flex: 'flex',
            active: 'active'
        };
        // 정제된 userData를 careRecvDetail 페이지에 넘겨줌
        res.render('careRecvDetail', { userData, styles });
    });
});

// 매칭 상태 바꾸기
router.get("/update-status", (req, res) => {
    const careReceiverId = req.query.careReceiverId;
    const newStatus = req.query.newStatus === '1' ? 0 : 1;

    let sql = "UPDATE TB_MATCHING SET MATCH_STATUS = ? WHERE CARE_RECEIVER_ID = ?";
    conn.query(sql, [newStatus, careReceiverId], (err) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/matching');
    });
});

module.exports = router;
