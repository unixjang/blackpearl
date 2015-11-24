/**
 * Created by hyochan on 8/8/15.
 */
var express = require('express');
var router = express.Router();
var header = require('../../appset/global/header');
var rescode = require('../../appset/global/resCode');

// mongoose schema
var User = require('../../appset/mongoose/schema/User');

/*
    POST    :   "/"       ==> login
    GET     :   "/check"  ==> 로그인 확인
    GET     :   "/logout" ==> 로그아웃
*/

// 로그인
router
    .post('/', function(req, res){
        var user_login = {id:req.body.id, pw:req.body.pw};
        var result ={};

        if(!user_login.id || !user_login.pw){
            console.log("no req param");
            result.resultCode = rescode.NO_REQ_PARAM;
            header.sendJSON(result, res);
        }else{
            User.findOne({id : user_login.id, pw : user_login.pw}, function(err, user){
                if(err){
                    console.log(err.message);
                    result.resultCode = rescode.FAILED;
                    result.errMsg = err.message;
                    header.sendJSON(result, res);
                }
                else{
                    if(!user){
                        req.session.regenerate(function(){
                            var msg = "no login user found";
                            console.log(msg);
                            req.session.error = 'Authentication failed.';
                            result.resultCode = rescode.FAILED;
                            result.errMsg = msg;
                            header.sendJSON(result, res);
                        });
                    }
                    else {
                        req.session.regenerate(function(){
                            console.log("login success");
                            req.session.user = user_login;
                            req.session.success = 'Authenticated as ' + user.id;
                            result.resultCode = rescode.SUCCESS;
                            result.id = req.session.user.id;
                            header.sendJSON(result, res);
                        });
                    }
                }
            });
        }
    })
    .get('/logout', function(req, res){
        var result ={};
        req.session.destroy(function(err){
            if(err){
                result.resultCode = rescode.FAILED;
                result.errMsg = err.message;
            }
            else{
                console.log("logout success");
                result.resultCode = rescode.SUCCESS;
            }
            header.sendJSON(result, res);
        });
    })
    .get('/check', function(req, res){
        var result = {};
        if(req.session.user){
            result.resultCode = rescode.SUCCESS;
            result.id = req.session.user.id;
        }else{
            result.resultCode = rescode.FAILED;
            result.errMsg = "user is not logged in";
        }
        header.sendJSON(result, res);
    });

module.exports = router;
