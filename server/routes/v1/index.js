var express = require('express');
var router = express.Router();

var health = require('./health');

router.use('/health', health);

module.exports = router;
