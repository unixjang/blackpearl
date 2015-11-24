/**
 * Created by hyochan on 8/23/15.
 */

/*
    need requrl.js file
    ㅇ const requrl = "http://localhost";
    ㅇ module.exports = requrl;
    var requrl = require('./requrl');
*/

// const requrl = "http://hyochan.org";
const requrl = "http://localhost:9000";
const url_node = requrl + ":52273/";
const url_client = requrl; // +"/blackpearl/angular";

const appset = {
    url_node : url_node,
    url_client : url_client,
    public_path : "./public", // public path
    empty_usr_img : "/profile/user_empty.png", // http usr_img 경로
    mongodbUrl : "mongodb://localhost/",
    dbName : "blackpearl"
};

module.exports = appset;