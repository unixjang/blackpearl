/**
 * Created by hyochan on 8/14/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Promise = require('bluebird');

var header = require('../../appset/global/header');
var rescode = require('../../appset/global/resCode');

// mongoose schema
var User = require('../../appset/mongoose/schema/User');

/*var mongodb = require('../../appset/config/mongoClient');
var assert = require('assert');*/

// needs file upload
var multer  = require('multer');
var upload = multer({
    dest: './public/profile/img'
});

/*
    POST    :   "/"         ==> 회원가입
 */

// 회원가입
router
    .post('/', upload.single('image'), function(req, res){
        var result ={};

        if(!req.body.id || !req.body.pw || !req.body.name || !req.body.phone || !req.body.email) {
            console.log("NO_REQ_PARAM");
            if(!req.body.id){
                console.log("NO ID");
            }
            if(!req.body.pw){
                console.log("NO PW");
            }
            if(!req.body.name){
                console.log("NO NAME");
            }
            if(!req.body.phone){
                console.log("NO PHONE");
            }
            if(!req.body.email){
                console.log("NO EMAIL");
            }
            result.resultCode = rescode.NO_REQ_PARAM;
            header.sendJSON(result, res);
        } else{
            console.log("id : " + req.body.id);
            console.log("pw : " + req.body.pw);
            console.log("name : " + req.body.name);
            console.log("phone : " + req.body.phone);
            console.log("email : " + req.body.email);

            var user = new User({
                id: req.body.id,
                img : "/profile/user_empty.png",
                pw: req.body.pw,
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email
            });
            // 이미지 업로드
            if(req.file){
                var image = req.file;
                var imagePath = image.destination + "/" + image.filename;
                console.log("image path : " + imagePath);
                var user_img = user.id + ".png";
                // img string should not have a white space
                user_img = user_img.replace(/ /g,'');
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
                            /// let's see it
                            if(err){throw err;}
                            else{
                                // success : delete dummy file
                                fs.unlink(imagePath);
                                // change user img
                                user.img = "/profile/img" + user_img;
                            }
                            // save user
                            saveUser(user, result, req, res);
                        });
                    }
                });
            }else{
                // save user
                saveUser(user, result, req, res);
            }
        }
    });

function saveUser(user, result, req, res){
    // call the built-in save method to save to the database
    user.save(function(err) {
        if (err) {
            console.log("this user already exist");
            console.log(err.message);
            result.resultCode = rescode.ALREADY_INSERTED;
            result.errMsg = err.message;
            res.setHeader('Content-Type', 'application/json; charset=utf8');
            res.json(result);
        } else{
            console.log('User saved successfully!');
            // GENERATE SESSION AFTER SIGNUP TO AUTOMATICALLY LOGIN
            req.session.regenerate(function(){
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.id;
                result.id = req.session.user.id;
                result.resultCode = rescode.SUCCESS;
                header.sendJSON(result, res);
            });
        }
    });
}

module.exports = router;
