/**
 * Created by hyochan on 8/20/15.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send("operation finished!!");
});

module.exports = router;
