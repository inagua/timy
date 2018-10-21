var express = require('express');
var router = express.Router();

router.get('/actions', function (req, res) {
    res.json({message: 'actions!'});
});

router.post('/actions', function (req, res) {
    res.json({message: 'actions'});
});

module.exports = router;

const sample = {
    "message": "start command!",
    "query": "{}",
    "body": {
        "token": "jTsNQ5HnQ9aKdFg6Rmw6vx47",
        "team_id": "T1623MCPR",
        "team_domain": "inagua",
        "channel_id": "D1KHADZDZ",
        "channel_name": "directmessage",
        "user_id": "U1635ND18",
        "user_name": "jacques",
        "command": "/start",
        "text": "",
        "response_url": "https://hooks.slack.com/commands/T1623MCPR/461120762117/1pGhvM9hTYnHP93lJdiehODx",
        "trigger_id": "460186141232.40071726807.97d6f0508f53c669ae99d475cf05f11d"
    }
};