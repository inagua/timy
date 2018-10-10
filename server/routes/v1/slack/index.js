var express = require('express');
var router = express.Router();

var start = require('./start');
var actions = require('./actions');
var options = require('./optionsactions');

// http://timy-prod.us-west-2.elasticbeanstalk.com/api/v1/slack/...
router.use('/', start);
router.use('/', actions);
router.use('/', options);

module.exports = router;
