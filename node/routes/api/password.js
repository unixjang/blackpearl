/**
 * Created by hyochan on 9/13/15.
 */
var express = require('express');
var router = express.Router();
var header = require('../../appset/global/header');
var rescode = require('../../appset/global/resCode');

// mongoose schema
var User = require('../../appset/mongoose/schema/User');

/*
    POST   :   "/update"       ==> 암호 변경
 */

//
router
    .post('/update', function(req, res){
        var result = {};
        var prev_pw = req.body.prev_pw;
        var pw = req.body.pw;

        console.log("prev_pw : " + prev_pw);
        console.log("pw : " + pw);

        if(!prev_pw || !pw){
            result.resultCode = rescode.NO_REQ_PARAM;
            console.log("no req param");
            header.sendJSON(result, res);
        }else{
            if(req.session.user) {
                // condition, update, options, callback
                var condition = {
                    id : req.session.user.id,
                    pw : prev_pw
                };
                var update = { $set: {
                    pw : pw
                }};
                var options = {new : true, upsert : true};
                User.findOneAndUpdate(condition, update, options, function(err, user){
                    if(err) {
                        var err_msg = condition.id +"님 암호가 올바르지 않습니다.";
                        console.log(err_msg);
                        result.resultCode = rescode.FAILED;
                        result.errMsg = err.message;
                        result.alert = err_msg;
                        header.sendJSON(result, res);
                    }
                    else{
                        if(!user){
                            console.log("사용자가 없습니다.");
                            result.resultCode = rescode.NO_DATA;
                            res.setHeader('Content-Type', 'application/json; charset=utf8');
                            res.json(result);
                        }else{
                            console.log("업데이트 성공.");
                            result.resultCode = rescode.SUCCESS;
                            header.sendJSON(result, res);
                        }
                    }
                });
            }else{
                var err_msg = "user is not logged in";
                console.log(err_msg);
                result.resultCode = rescode.FAILED;
                result.errMsg = err_msg;
                header.sendJSON(result, res);
            }
        }
    });

module.exports = router;
