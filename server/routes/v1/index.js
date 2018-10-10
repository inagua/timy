var express = require('express');
var router = express.Router();

var health = require('./health');
var slack = require('./slack');

router.use('/health', health);
router.use('/slack', slack);

module.exports = router;
