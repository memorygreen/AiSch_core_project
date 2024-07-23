const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 날짜 형식을 YYYY-MM-DD로 변환하는 함수
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더합니다
    const day = String(date.getDate()).padStart(2, '0'); // 날짜를 두 자리 숫자로 포맷합니다
    return `${year}-${month}-${day}`;
}

// 매칭 리스트 페이지
router.get("/", (req, res) => {
    let sql = "SELECT B.CARE_RECEIVER_NAME, A.MATCH_IDX, A.USER_ID, A.CARE_RECEIVER_ID, A.MATCH_MATCHED_AT, A.MATCH_STATUS FROM TB_MATCHING AS A JOIN TB_CARE_RECEIVER AS B ON A.CARE_RECEIVER_ID = B.CARE_RECEIVER_ID";
    conn.query(sql, (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        // 배열 생성
        let arr = [];

        // 각 row를 배열에 추가
        rows.forEach(row => {
            arr.push({
                careReceiverName: row.CARE_RECEIVER_NAME,
                matchIdx: row.MATCH_IDX,
                userId: row.USER_ID,
                careReceiverId: row.CARE_RECEIVER_ID,
                matchMatchedAt: formatDate(row.MATCH_MATCHED_AT), // 날짜 형식 변환
                matchStatus: row.MATCH_STATUS,
            });
        });

        console.log(arr);
        // 배열을 템플릿에 전달
        res.render('matching', { arr });
    });
});

// 상세 정보 페이지
router.get("/detail", (req, res) => {
    let sql = "SELECT * FROM TB_CARE_RECEIVER WHERE CARE_RECEIVER_ID = ?";
    const careReceiverId = req.query.careReceiverId;
    console.log("crid : " + careReceiverId);
    conn.query(sql, [careReceiverId], (err, rows) => {
        console.log(rows)
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        let arr = [];

        rows.forEach(row => {
            arr.push({
                careReceiverName: row.CARE_RECEIVER_NAME,
                careReceiverBirth: row.CARE_RECEIVER_BIRTH,
                careReceiverGender: row.CARE_RECEIVER_GENDER,
                careReceiverPhone: row.CARE_RECEIVER_PHONE,
                careReceiverDays: row.CARE_RECEIVER_DAYS,
            });
        });
        console.log(arr)

        // 배열을 템플릿에 전달
        res.render('matching2', { arr });
    });
});

router.get("/update-status", (req, res) => {
    const careReceiverId = req.query.careReceiverId;
    const newStatus = req.query.newStatus === '1' ? 0 : 1; // 현재 상태의 반대값으로 설정

    let sql = "UPDATE TB_MATCHING SET MATCH_STATUS = ? WHERE CARE_RECEIVER_ID = ?";
    conn.query(sql, [newStatus, careReceiverId], (err) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/matching'); // 상태 업데이트 후 매칭 리스트 페이지로 리다이렉트
    });
});

module.exports = router;
