var express = require('express');
var router = express.Router();

router.get('/options', function(req, res) {
    res.json({ message: 'actions!' });
});

router.post('/actions', function(req, res) {
    res.json({ message: 'actions' });
});

module.exports = router;
