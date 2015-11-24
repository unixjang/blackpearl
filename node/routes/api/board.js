/**
 * Created by hyochan on 10/12/15.
 */
var express = require('express');
var fs = require('fs');
var Promise = require('bluebird');

// see my bookmark list
var router = express.Router();
var header = require('../../appset/global/header');
var resCode = require('../../appset/global/resCode');
var appSet = require('../../appSet');
var User = require('../../appset/mongoose/schema/User');
var Board = require('../../appset/mongoose/schema/Board');

router
    .get("/my", function(req, res){

    });

module.exports = router;