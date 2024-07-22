const express = require("express");
const router = express.Router();
const conn = require("../config/db");

router.get("/", (req, res) => {
    let sql = "SELECT * FROM TB_MATCHING";
    conn.query(sql, (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        let arr = rows.map(row => ({
            matchIdx: row.MATCH_IDX,
            userId: row.USER_ID,
            careReceiverId: row.CARE_RECEIVER_ID,
            matchMatchedAt: row.MATCH_MATCHED_AT,
            matchStatus: row.MATCH_STATUS,
        }));

        // 모든 데이터 처리가 완료된 후, 한 번만 render 호출
        res.render('matching', { arr });
    });
});

module.exports = router;
