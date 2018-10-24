const express = require('express');
const router = express.Router();
const _ = require('lodash');
const minimist = require('minimist');


//
// SLACK
//
const {WebClient} = require('@slack/client');
const token = process.env.SLACK_TOKEN || 'xoxb-40071726807-452641863731-oIMuBKqUHBJTcETBJv7xVhl5'; // jTsNQ5HnQ9aKdFg6Rmw6vx47
const web = new WebClient(token);


//
// AMAZON
//
const S3Config = {
    Bucket: 'elasticbeanstalk-us-west-2-711404857168'
};
const S3 = require('./aws-s3');
const s3 = new S3(S3Config.Bucket);


//
// TIMY
//
const ReportCommand = require('../../../../commands/report.command');
const reportCommand = new ReportCommand();
const Engine = require('../../../../commands/engine');
const engine = new Engine();
const minimistOptions = {};
const usage = {};





function isMessageFromBot(event) {
    return event.bot_id || event.subtype == 'bot_message';
}

function isLocal(req) {
    return _.get(req, 'headers.host').indexOf('localhost') == 0;
}

function sendAnswerTo(answer, conversationId, req, res) {
    if (isLocal(req)) {
        res.send(answer);

    } else {
        web.chat.postMessage({
            channel: conversationId,
            text: answer
        })
            .then((res) => {
                console.error('(c2) SUCCESS: message sent with response:', res);
            })
            .catch(err => {
                console.error('(c3) ERROR: ', err);
            });

    }
}

function handleEvent(message, now, succewssCB, errorCB) {
    const team = _.get(message, 'team_id');
    const user = _.get(message, 'event.user');
    const command = _.get(message, 'event.text');

    if (team && user && command) {
        // key = 'trackings/slack/iem/timy-jco-181003.json';
        const key = s3.bucketForTeamAndUser(team, user);
        s3.loadJSON(key, function (loadedJson) {
            const json = loadedJson || {};

            const tokens = command.split(' ');
            engine.handle(json, minimist(tokens), now)
                .then(status => { // { activated, modified, json }

                    let result = '';
                    if (!status.activated) {
                        engine.cli(minimistOptions, usage);
                        result = 'Sorry Buddy, but I do not understand. This is my commands:' + JSON.stringify(usage);

                    } else if (status.modified) {
                        s3.saveJSON(json, key);
                        const report = reportCommand.buildReport(json, now);
                        result = 'Done Buddy! This is the status:' + JSON.stringify(report);

                    }
                    succewssCB(result);
                });

        })
    } else {
        const error = '[ERROR] handleEvent: Missing one of team_id, event.user and event.text.';
        if (errorCB) {
            errorCB(error);
        } else {
            console.error(error);
        }
    }

}

router.post('/events', function (req, res) {

    const now = new Date();
    console.log('(c1) /events:', new Date(), ` - req:`, req.body);
    const event = req.body.event;

    // https://api.slack.com/events/url_verification
    if (req.body && req.body.type === "url_verification") {
        res.send(req.body.challenge);

    } else {
        if (!isMessageFromBot(event)) {
            handleEvent(req.body, now, function (success) {
                // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
                const conversationId = event.channel;
                sendAnswerTo(success, conversationId, req, res);
            });

        }
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


const aReceivedFromTimy = {
    token: 'jTsNQ5HnQ9aKdFg6Rmw6vx47',
    team_id: 'T1623MCPR',
    api_app_id: 'ADAJTG9K5',
    event:
        {
            text: 'Hy I\'am TIMy, nice to meet you... I am analysing your command:start HiOnMonday4',
            username: 'TIMy',
            bot_id: 'BDAT53JJ1',
            type: 'message',
            subtype: 'bot_message',
            ts: '1540206490.000200',
            channel: 'DDAT53KPX',
            event_ts: '1540206490.000200',
            channel_type: 'im'
        },
    type: 'event_callback',
    event_id: 'EvDJMPP0GZ',
    event_time: 1540206490,
    authed_users: ['UDAJVRDMH']
};

const aReceivedFromJacques = {
    token: 'jTsNQ5HnQ9aKdFg6Rmw6vx47',
    team_id: 'T1623MCPR',
    api_app_id: 'ADAJTG9K5',
    event:
        {
            type: 'message',
            user: 'U1635ND18',
            text: 'start HiOnMonday4',
            client_msg_id: '71a6acf8-81b7-43e5-8361-315edd10dc18',
            ts: '1540206490.000100',
            channel: 'DDAT53KPX',
            event_ts: '1540206490.000100',
            channel_type: 'im'
        },
    type: 'event_callback',
    event_id: 'EvDKFXK4S1',
    event_time: 1540206490,
    authed_users: ['UDAJVRDMH']
};

const aSentByTimyResponse = {
    ok: true,
    channel: 'DDAT53KPX',
    ts: '1540206493.000100',
    message:
        {
            text: 'Hy I\'am TIMy, nice to meet you... I am analysing your command:start HiOnMonday4',
            username: 'TIMy',
            bot_id: 'BDAT53JJ1',
            type: 'message',
            subtype: 'bot_message',
            ts: '1540206493.000100'
        },
    scopes: ['identify', 'bot:basic'],
    acceptedScopes: ['chat:write:bot', 'post']
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