const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let userId = req.session.userId;
    let userType = req.session.userType;
    res.render('main', {userId, userType});
});

module.exports = router;
