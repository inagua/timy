var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome on TIMy!' });
});

module.exports = router;
