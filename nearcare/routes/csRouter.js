const express = require("express");
const router = express.Router();
const conn = require("../config/db");
const formatDate = require("../public/js/formatDate");

// 고객센터 목록 페이지
router.get("/", (req, res) => {
    let sql = "SELECT * FROM TB_CS ORDER BY CS_IDX DESC";
    conn.query(sql, (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        let arr = rows.map(row => ({
            csId: row.CS_IDX,
            csType: row.CS_TYPE,
            csTitle: row.CS_TITLE,
            csFile: row.FILE,
            csCreatedAt: formatDate(row.CS_CREATED_AT),
            csAnswer: row.AS_CONTENT ? "답변완료" : ""
        }));

        res.render('cs', { arr });
    });
});

// 고객센터 상세 페이지
router.get("/detail", (req, res) => {
    const csId = req.query.csId;
    let sql = "SELECT A.CS_IDX, A.CS_TYPE, A.CS_TITLE, A.CS_CONTENT, A.CS_FILE, A.CS_CREATED_AT, B.AS_CONTENT, B.AS_CREATED_AT FROM TB_CS AS A LEFT JOIN TB_AS AS B ON A.CS_IDX = B.CS_IDX WHERE A.CS_IDX = ?";
    conn.query(sql, [csId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (rows.length > 0) {
            const row = rows[0];
            res.render('csdetail', {
                csId: row.CS_IDX,
                csType: row.CS_TYPE,
                csTitle: row.CS_TITLE,
                csContent: row.CS_CONTENT,
                csFile: row.CS_FILE,
                csCreatedAt: formatDate(row.CS_CREATED_AT),
                csAnswer: row.AS_CONTENT || '',
                asCreatedAt: row.AS_CREATED_AT ? formatDate(row.AS_CREATED_AT) : ''
            });
        } else {
            res.status(404).send('Not Found');
        }
    });
});

// 고객센터 글쓰기 페이지 이동
router.get("/create", (req, res) => {
    res.render('createCs');
});

// 고객센터 글 생성 insert
router.post("/create", (req, res) => {
    const { csType, csTitle, csContent } = req.body;
    const createdAt = new Date();
    
    let sql = "INSERT INTO TB_CS (USER_ID ,CS_TYPE, CS_TITLE, CS_CONTENT, CS_CREATED_AT) VALUES ('user001', ?, ?, ?, ?)";
    conn.query(sql, [csType, csTitle, csContent, createdAt], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect('/cs');
    });
});

// 삭제 확인 페이지
router.get("/delete", (req, res) => {
    const csId = req.query.csId;
    let sql = "SELECT CS_IDX, CS_TITLE FROM TB_CS WHERE CS_IDX = ?";
    conn.query(sql, [csId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (rows.length > 0) {
            const row = rows[0];
            res.render('deleteCs', {
                csId: row.CS_IDX,
                csTitle: row.CS_TITLE
            });
        } else {
            res.status(404).send('Not Found');
        }
    });
});

// 고객센터 글 삭제
router.post("/delete", (req, res) => {
    const csId = req.body.csId;
    
    let sql = "DELETE FROM TB_CS WHERE CS_IDX = ?";
    conn.query(sql, [csId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect('/cs');
    });
});

// 고객센터 글 수정 페이지 이동
router.get("/edit", (req, res) => {
    const csId = req.query.csId;
    let sql = "SELECT * FROM TB_CS WHERE CS_IDX = ?";
    conn.query(sql, [csId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (rows.length > 0) {
            const row = rows[0];
            res.render('csUpdate', {
                csId: row.CS_IDX,
                csType: row.CS_TYPE,
                csTitle: row.CS_TITLE,
                csContent: row.CS_CONTENT
            });
        } else {
            res.status(404).send('Not Found');
        }
    });
});

// 고객센터 글 수정 업데이트
router.post("/update", (req, res) => {
    const { csId, csType, csTitle, csContent } = req.body;
    
    let sql = "UPDATE TB_CS SET CS_TYPE = ?, CS_TITLE = ?, CS_CONTENT = ? WHERE CS_IDX = ?";
    conn.query(sql, [csType, csTitle, csContent, csId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect('/cs');
    });
});



module.exports = router;
