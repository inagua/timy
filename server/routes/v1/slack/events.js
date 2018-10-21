var express = require('express');
var router = express.Router();

const { WebClient } = require('@slack/client');
const token = process.env.SLACK_TOKEN || 'xoxb-40071726807-452641863731-oIMuBKqUHBJTcETBJv7xVhl5'; // jTsNQ5HnQ9aKdFg6Rmw6vx47
const web = new WebClient(token);


router.post('/events', function(req, res) {

    console.log('>>>>> (1) Events:', new Date(), ` - token:${token} - `, req.body);

    // https://api.slack.com/events/url_verification
    if (req.body && req.body.type === "url_verification") {
        res.send(req.body.challenge);

    } else {
        // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
        const conversationId = req.body.channel || 'CDJ5NJL3S'; // timy-test

        console.log('>>>>> (2) Send message to:', conversationId, req.body);
        // res.json({ message: 'events!', body: JSON.stringify(req.body) });
// See: https://api.slack.com/methods/chat.postMessage
        web.chat.postMessage({ channel: conversationId, text: JSON.stringify(req.body) })
            .then((res) => {
                // `res` contains information about the posted message
                console.log('>>>>> (3) Message sent:', conversationId, res.ts);

                const secondChannel = req.body.event.user;
                console.log('>>>>> (4) Send 2nd message to:', secondChannel, req.body);
                web.chat.postMessage({ channel: secondChannel, text: JSON.stringify(req.body) })
                    .then((res) => {
                        console.log('>>>>> (5) 2nd Message sent to:', res.ts);
                        // res.sendStatus(200);
                    })
                    .catch(err => {
                        console.error('>>>>> (6) 2nd ERROR: ', err);
                    });

            })
            .catch(err => {
                console.error('>>>>> (7) ERROR: ', err);
            });
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