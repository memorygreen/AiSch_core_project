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

        // 배열을 템플릿에 전달
        res.render('matching', { arr });
    });
});

// 상세 정보 페이지
router.get("/detail", (req, res) => {
    let sql = "SELECT * FROM TB_CARE_RECEIVER WHERE CARE_RECEIVER_ID = ?";
    const careReceiverId = req.query.careReceiverId;
    conn.query(sql, [careReceiverId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        // 단일 객체 반환
        if (rows.length > 0) {
            const row = rows[0];
            res.send({
                receive_care_name: row.RECEIVE_CARE_NAME,
                receive_care_birth: row.RECEIVE_CARE_BIRTH,
                receive_care_gender: row.RECEIVE_CARE_GENDER,
                receive_care_phone: row.RECEIVE_CARE_PHONE,
                receive_care_level: row.RECEIVE_CARE_LEVEL,
                receive_care_add: row.RECEIVE_CARE_ADD,
            });
        } else {
            res.status(404).send('Detail not found');
        }
    });
});

module.exports = router;
