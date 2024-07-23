const express = require("express");
const router = express.Router();
const conn = require("../config/db");
const formatDate = require("../public/js/formatDate");

router.get("/", (req, res) => {
    let sql = "SELECT * FROM TB_CS";
    conn.query(sql, (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        let arr = [];

        rows.forEach(row => {
            arr.push({
                csType: row.CS_TYPE,
                csTitle: row.CS_TITLE,
                csContent: row.CS_CONTENT,
                csFile: row.FILE,
                csCreatedAt: formatDate(row.CS_CREATED_AT),
            });
        });

        console.log(arr);
        
    });
    res.render('cs');
});

module.exports = router;