var express = require('express');
var router = express.Router();

router.get('/start', function(req, res) {
    res.json({ message: 'start command!' });
});

router.post('/start', function(req, res) {
    res.json({ message: 'start command!', query: JSON.stringify(req.query), body: JSON.stringify(req.body) });
});

module.exports = router;
