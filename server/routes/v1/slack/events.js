var express = require('express');
var router = express.Router();

const { WebClient } = require('@slack/client');
const token = process.env.SLACK_TOKEN || 'xoxb-40071726807-452641863731-oIMuBKqUHBJTcETBJv7xVhl5';
const web = new WebClient(token);


router.post('/events', function(req, res) {

    console.log('>>>>> events!');

    // https://api.slack.com/events/url_verification
    if (req.body && req.body.type === "url_verification") {
        res.send(req.body.challenge);

    } else {
        console.log('>>>>> ', req.body);
        // res.json({ message: 'events!', body: JSON.stringify(req.body) });
// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
        const conversationId = req.body.channel || 'C1232456';
// See: https://api.slack.com/methods/chat.postMessage
        web.chat.postMessage({ channel: conversationId, text: JSON.stringify(req.body) })
            .then((res) => {
                // `res` contains information about the posted message
                console.log('Message sent: ', res.ts);
                res.sendStatus(200);
            })
            .catch(console.error);
    }
});

router.get('/events', function(req, res) {

    console.log('>>>>> Ping!');
    res.send('Ping!');

});

module.exports = router;



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