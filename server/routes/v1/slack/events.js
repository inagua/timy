var express = require('express');
var router = express.Router();

const {WebClient} = require('@slack/client');
const token = process.env.SLACK_TOKEN || 'xoxb-40071726807-452641863731-oIMuBKqUHBJTcETBJv7xVhl5'; // jTsNQ5HnQ9aKdFg6Rmw6vx47
const web = new WebClient(token);


router.post('/events', function (req, res) {

    console.log('>>>>> (b1) Events:', new Date(), ` - token:${token} - `, req.body);
    const event = req.body.event;

    // https://api.slack.com/events/url_verification
    if (req.body && req.body.type === "url_verification") {
        res.send(req.body.challenge);

    } else if (event.user == 'U1635ND18') {
        // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
        const conversationId = event.channel;
        web.chat.postMessage({channel: conversationId, text: "Hy I'am TIMy, nice to meet you... I am analysing your command:" + event.text})
            .then((res) => {
                console.error('>>>>> (b2) SUCCESS: message sent with response:', res);
            })
            .catch(err => {
                console.error('>>>>> (b3) ERROR: ', err);
            });
    }
});

router.get('/events', function (req, res) {

    console.log('>>>>> Ping!');
    res.send('Ping!');

});

module.exports = router;

const sample = {
    "token": "jTsNQ5HnQ9aKdFg6Rmw6vx47",
    "team_id": "T1623MCPR",
    "api_app_id": "ADAJTG9K5",
    "event": {
        "type": "dnd_updated_user",
        "user": "U1635ND18",
        "dnd_status": {"dnd_enabled": false, "next_dnd_start_ts": 1, "next_dnd_end_ts": 1},
        "event_ts": "1540140022.000300"
    },
    "type": "event_callback",
    "event_id": "EvDJ6ULJ80",
    "event_time": 1540140022,
    "authed_users": ["UDAJVRDMH"]
};

const messageSentOnTimyChannel = {
    "token": "jTsNQ5HnQ9aKdFg6Rmw6vx47",
    "team_id": "T1623MCPR",
    "api_app_id": "ADAJTG9K5",
    "event": {
        "type": "message",
        "user": "U1635ND18",
        "text": "test to u!",
        "client_msg_id": "e91daef0-d9c8-4be4-8e15-cdf2e1816172",
        "ts": "1540145472.000100",
        "channel": "DDAT53KPX",
        "event_ts": "1540145472.000100",
        "channel_type": "im"
    },
    "type": "event_callback",
    "event_id": "EvDJ7DEHA4",
    "event_time": 1540145472,
    "authed_users": ["UDAJVRDMH"]
};


const a = {
    "token": "jTsNQ5HnQ9aKdFg6Rmw6vx47",
    "team_id": "T1623MCPR",
    "api_app_id": "ADAJTG9K5",
    "event": {
        "type": "message",
        "user": "U1635ND18",
        "text": "hi guy!",
        "client_msg_id": "ffeaaa51-1ab6-45fd-bdfe-07b808f11db6",
        "ts": "1540145929.000100",
        "channel": "DDAT53KPX",
        "event_ts": "1540145929.000100",
        "channel_type": "im"
    },
    "type": "event_callback",
    "event_id": "EvDJV31ASE",
    "event_time": 1540145929,
    "authed_users": ["UDAJVRDMH"]
};

/*
const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'C1232456';

// See: https://api.slack.com/methods/chat.postMessage
web.chat.postMessage({ channel: conversationId, text: 'Hello there' })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);
 */