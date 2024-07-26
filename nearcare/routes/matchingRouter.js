const express = require("express");
const router = express.Router();
const conn = require("../config/db");
const formatDate = require("../public/js/formatDate");

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

// 매칭페이지 상세보기
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
                careReceiverBirth: formatDate(row.CARE_RECEIVER_BIRTH),
                careReceiverGender: row.CARE_RECEIVER_GENDER,
                careReceiverPhone: row.CARE_RECEIVER_PHONE,
                careReceiverDays: row.CARE_RECEIVER_DAYS,
            });
        });
        console.log(arr)

        res.render('matching2', { arr });
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
