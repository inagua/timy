var express = require('express');
var router = express.Router();

var start = require('./start');
var actions = require('./actions');
var options = require('./options');
var events = require('./events');

// http://timy-prod.us-west-2.elasticbeanstalk.com/api/v1/slack/...
router.use('/', start);
router.use('/', actions);
router.use('/', options);
router.use('/', events);

module.exports = router;

const body = { // actions
    "token": "jTsNQ5HnQ9aKdFg6Rmw6vx47",
    "team_id": "T1623MCPR",
    "team_domain": "inagua",
    "channel_id": "DDAT53KPX", // @TIMy channel
    "channel_name": "directmessage",
    "user_id": "U1635ND18",
    "user_name": "jacques",
    "command": "/start",
    "text": "gtechna",
    "response_url": "https://hooks.slack.com/commands/T1623MCPR/455010441350/AY279dAq59CCIAOn19cQAYKy",
    "trigger_id": "453474199908.40071726807.2c2c0087b3f6165e3ce3661830cd8742"
};