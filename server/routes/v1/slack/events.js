var express = require('express');
var router = express.Router();

router.post('/events', function(req, res) {
    res.json({ message: 'events!', body: JSON.stringify(req.body) });
});

module.exports = router;
