/**
 * Created by hyochan on 8/23/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');

var header = require('../../appset/global/header');
var rescode = require('../../appset/global/resCode');
var appset = require('../../appSet');
var User = require('../../appset/mongoose/schema/User');

// needs file upload
var multer  = require('multer');
var upload = multer({
    dest: './public/profile/img'
});

/*
    GET  :  "select"       ==> 프로필 선택
    POST :  "update"       ==> 프로필 수정
 */

// 프로필 불러오기
router
    // 본인(로그인 된) 프로필 불러오기
    .get('/select', function(req, res){
        var result = {};
        if(req.session.user){
            var id = req.session.user.id;
            User.findOne({id : id}, function(err, user){
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
                            // 파일 없음
                            user.img = appset.empty_usr_img;
                            console.log("user img doesn't exist : " + user.img);
                        }
                        result.user = user;
                        header.sendJSON(result, res);
                    }
                }
            });
        }else{
            result.resultCode = rescode.FAILED;
            result.errMsg = "user is not logged in";
            header.sendJSON(result, res);
        }
    });
    router
        // 상대 프로필 불러오기
        .get('/select/:id', function(req, res){
            var result = {};
            var id = req.params.id;
            User.findOne({id : id}, "id img name phone email create_at update_at", function(err, user){
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
                            // 파일 없음
                            user.img = appset.empty_usr_img;
                            console.log("user img doesn't exist : " + user.img);
                        }
                        result.user = user;
                        header.sendJSON(result, res);
                    }
                }
            });
        });

// 프로필 수정하기
router
    // 참고 : upload를 넣지 않으면 formData가 node 서버에 안올라간다.
    .post('/update', upload.single('image'), function(req, res){
        var result = {};

        if(!req.body.name || !req.body.phone || !req.body.email){
            console.log("no req params");
            result.responseCode = rescode.NO_REQ_PARAM;
            header.sendJSON(result, res);
        }
        else{
            var name = req.body.name;
            var phone = req.body.phone;
            var email = req.body.email;

            console.log("name : " + name);
            console.log("phone : " + phone);
            console.log("email : " + email);

            // condition, update, options, callback
            var condition = {id : req.session.user.id};
            var update = {};
            var options = {new : true, upsert : true};

            if(req.session.user){
                var upload_img = "/profile/user_empty.png";
                // 이미지 업로드
                if(req.file){
                    var image = req.file;
                    var imagePath = image.destination + "/" + image.filename;
                    console.log("image path : " + imagePath);
                    var user_img = req.session.user.id + ".png"; // different part from signup
                    // img string should not have a white space
                    user_img = user_img.replace(/ /g,'');
                    upload_img = "/profile/img/" + user_img;     // different part from signup
                    console.log("user_img : " + user_img);
                    fs.readFile(imagePath, function (err, data) {
                        var imageName = image.filename;
                        /// If there's an error
                        if(!imageName){
                            console.log("There was an error in image file");
                            // failed : delete file if dummy exist
                            if(fs.existsSync(imagePath)) {
                                fs.unlink(imagePath);
                            }
                        } else {
                            user_img = "/" + user_img;
                            var newPath = image.destination + user_img;
                            /// write file to uploads/fullsize folder
                            fs.writeFile(newPath, data, function (err) {
                                if(err){throw err;}
                                else{
                                    // success : delete dummy file
                                    fs.unlink(imagePath);
                                }
                            });
                        }
                    });
                    update = {
                        $set: {
                            img: upload_img,
                            name: name,
                            phone : phone,
                            email : email
                        }
                    };
                }else{
                    update = {
                        $set: { //img is not uploaded
                            name: name,
                            phone : phone,
                            email : email
                        }
                    };
                }

                User.findOneAndUpdate(condition, update, options, function(err, user){
                    if(err) {
                        result.resultCode = rescode.FAILED;
                        result.errMsg = err.message;
                        header.sendJSON(result, res);
                    }
                    else{
                        if(!user){
                            result.resultCode = rescode.NO_DATA;
                            result.errMsg = "no user found";
                            header.sendJSON(result, res);
                        }else{
                            result.resultCode = rescode.SUCCESS;
                            var path = appset.public_path + user.img;
                            if (!fs.existsSync(path)) {
                                // 이미지 없음
                                user.img = appset.empty_usr_img;
                                console.log("user img doesn't exist : " + user.img);
                            }
                            result.user = user;
                            header.sendJSON(result, res);
                        }
                    }
                });
            } else{
                result.resultCode = rescode.FAILED;
                result.errMsg = "user is not logged in";
                header.sendJSON(result, res);
            }
        }
    });


module.exports = router;