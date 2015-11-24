/**
 * Created by hyochan on 9/15/15.
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
var Bookmark = require('../../appset/mongoose/schema/Bookmark');

router
    .get("/my", function(req, res){
        var result = {};
        if(req.session.user) {
            var id = req.session.user.id;
            Bookmark.find({'id' : id}, function(err, bookmarks){
                if (err) {
                    console.log("err finding bookmark");
                    console.log(err.message);
                    result.resultCode = resCode.FAILED;
                    result.errMsg = err.message;
                    header.sendJSON(result, res);
                } else if(!bookmarks || bookmarks.length === 0) {
                    console.log("no bookmark found");
                    result.resultCode = resCode.NO_DATA;
                    header.sendJSON(result, res);
                } else{
                    result.bookmarks = [];
                    // IMPORTANT : 안에 query 들이 async하게 이루어지기 때문에 promise로 잡아준다.
                    var promises = bookmarks.map(function(bookmark) {
                        console.log("bookmark : " + bookmark.bookmark);
                        return User.findOne({id : bookmark.bookmark}, 'id img name phone email create_at update_at', function(err, user){
                            if(user){
                                var path = appSet.public_path + user.img;
                                if (!fs.existsSync(path)) {
                                    // 이미지 없음
                                    user.img = appSet.empty_usr_img;
                                    console.log("user img doesn't exist : " + user.img);
                                }
                                result.bookmarks.push(user);
                            }
                        });
                    });
                    Promise.all(promises)
                        .then(function() {
                            console.log("bookmarks found : " + result.bookmarks.length);
                            if(result.bookmarks.length === 0){
                                result.resultCode = resCode.NO_DATA;
                            }else{
                                result.resultCode = resCode.SUCCESS;
                            }
                            header.sendJSON(result, res);
                        })
                        .error(function(err){
                            result.resultCode = resCode.FAILED;
                            result.errMsg = err.message;
                            header.sendJSON(result, res);
                        });
                }
            });
        }else{
            result.resultCode = resCode.FAILED;
            result.errMsg = "user is not logged in";
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        }
    });

// add follower
router
    .get("/add/:bookmark", function(req, res){
        var result = {};
        if(req.session.user) {
            var id = req.session.user.id;
            var add = req.params.bookmark;

            console.log("bookmark : " + add);

            User.findOne({id : add}, 'id', function(err, user){
                if(!user){
                    result.resultCode = resCode.NO_DATA;
                    result.errMsg = "this is invalid user";
                    header.sendJSON(result, res);
                }else{
                    var bookmark = new Bookmark({
                        id : id,
                        bookmark : user.id
                    });
                    bookmark.save(function(err) {
                        if (err) {
                            console.log("this bookmark already exist");
                            result.resultCode = resCode.ALREADY_INSERTED;
                            result.errMsg = err.message;
                        } else {
                            result.resultCode = resCode.SUCCESS;
                            // result.user = JSON.stringify(req.params.user);
                            result.bookmark = bookmark;
                        }
                        header.sendJSON(result, res);
                    });
                }
            });
        }else{
            result.resultCode = resCode.FAILED;
            result.errMsg = "user is not logged in";
            header.sendJSON(result, res);
        }
    });

// add follower
router
    .get("/remove/:bookmark", function(req, res){
        var result = {};
        if(req.session.user) {
        var id = req.session.user.id;
        var remove = req.params.bookmark;

            Bookmark.findOneAndRemove({'id': id, 'bookmark' : remove}, function (err, bookmark) {
                if (err) {
                    console.log("err removing bookmark");
                    console.log(err.message);
                    result.resultCode = resCode.NO_DATA;
                    result.errMsg = err.message;
                } else if(!bookmark || bookmark.length === 0) {
                    console.log("no bookmark to be removed");
                    result.resultCode = resCode.NO_DATA;
                } else{
                    console.log("bookmark removed");
                    result.resultCode = resCode.SUCCESS;
                }
                header.sendJSON(result, res);
            });
        }else{
            result.resultCode = resCode.FAILED;
            result.errMsg = "user is not logged in";
            header.sendJSON(result, res);
        }
    });

module.exports = router;