/**
 * Created by hyochan on 9/13/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');

var header = require('../../appset/global/header');
var rescode = require('../../appset/global/resCode');
var appset = require('../../appSet');
var User = require('../../appset/mongoose/schema/User');
var Bookmark = require('../../appset/mongoose/schema/Bookmark');
/*
    GET     :   "one"          ==>  1명의 맴버 정보 불러오기
    GET     :   "all"          ==>  맴버들 불러오기
 */

// 맴버 한명 불러오기 ==> profile에서 불러오는건 북마크 회원인지 아닌지 확인 안함
router
    .get('/one/:id', function(req, res){
        var result = {};
        if(req.session.user){
            var id = req.session.user.id;
            var mem_id = req.params.id;
            User.findOne({id : mem_id}, 'id img name phone email update_at create_at', function(err, user){
                if(err){
                    result.resultCode = rescode.FAILED;
                    result.errMsg = err.message;
                    header.sendJSON(result, res);
                }
                else{
                    if(!user){
                        result.resultCode = rescode.NO_DATA;
                        header.sendJSON(result, res);
                    }else{
                        result.resultCode = rescode.SUCCESS;
                        var path = appset.public_path + user.img;
                        if (!fs.existsSync(path)) {
                            // 이미지 없음
                            user.img = appset.empty_usr_img;
                            console.log("user img doesn't exist : " + user.img);
                        }
                        // 북마크 회원인지 확인
                        Bookmark.find({id : id, bookmark : user.id}, function(err, bookmarks){
                            if(bookmarks.length !== 0){
                                result.bookmark = true;
                            }else{
                                result.bookmark = false;
                            }
                            result.user = user;
                            header.sendJSON(result, res);
                        });
                    }
                }
            });
        }else{
            result.resultCode = rescode.FAILED;
            result.errMsg = "you are not logged in";
            header.sendJSON(result, res);
        }
    });

// 맴버들 불러오기
router
    .get('/all', function(req, res){
        var result = {};
        if(req.session.user){
            var id = req.session.user.id;
            // 로그인 된 맴버 빼고 불러오기
            User.find({id: {'$ne':id }}, 'id img name phone email update_at create_at', function(err, users) {
                if (err) {
                    result.resultCode = rescode.FAILED;
                    result.errMsg = err.message;
                } else if(!users){
                    result.resultCode = rescode.NO_DATA;
                } else {
                    result.resultCode = rescode.SUCCESS;
                    users.forEach(function(user){
                        var path = appset.public_path + user.img;
                        if (!fs.existsSync(path)) {
                            // 이미지 없음
                            user.img = appset.empty_usr_img;
                        }
                        console.log("user img : " + user.img);
                    });
                    result.users = users;
                }
                header.sendJSON(result, res);
            });
        }else{
            result.resultCode = rescode.FAILED;
            result.errMsg = "user is not logged in";
            header.sendJSON(result, res);
        }
    });
module.exports = router;