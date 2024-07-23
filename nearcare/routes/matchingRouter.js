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

        res.render('matching', { arr });
    });
});

router.get("/detail", (req, res) => {
    let sql = "SELECT * FROM TB_CARE_RECEIVER WHERE CARE_RECEIVER_ID = ?";
    const careReceiverId = req.query.careReceiverId;
    conn.query(sql, [careReceiverId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        else {
            res.json(rows[0]);
        }
    });
});

module.exports = router;
