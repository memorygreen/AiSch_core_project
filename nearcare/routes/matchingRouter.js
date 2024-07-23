const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 매칭 리스트 페이지
router.get("/", (req, res) => {
    let sql = "SELECT * FROM TB_MATCHING";
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
                matchIdx: row.MATCH_IDX,
                userId: row.USER_ID,
                careReceiverId: row.CARE_RECEIVER_ID,
                matchMatchedAt: row.MATCH_MATCHED_AT,
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
    console.log("crid : "+careReceiverId);
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
                careReceiverGenter: row.CARE_RECEIVER_GENDER,
                careReceiverPhone: row.CARE_RECEIVER_PHONE,
                careReceiverDays: row.CARE_RECEIVER_DAYS,
            });
        });
        console.log(arr)

        // 배열을 템플릿에 전달
        res.render('matching2', { arr });

    });
});

module.exports = router;
