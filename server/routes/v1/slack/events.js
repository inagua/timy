var express = require('express');
var router = express.Router();

router.post('/events', function(req, res) {

    // https://api.slack.com/events/url_verification
    if (req.body && req.body.type === "url_verification") {
        res.send(req.body.challenge);

    } else {
        res.json({ message: 'events!', body: JSON.stringify(req.body) });
    }
});

module.exports = router;
