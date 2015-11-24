/**
 * Created by hyochan on 9/4/15.
 */
var mongoose = require('mongoose');
var appSet = require('../../../appSet');
var Schema = mongoose.Schema;

mongoose.createConnection(appSet.mongodbUrl + appSet.dbName);
var schema = new Schema({
    chatgrpName : {type: String, default : "all"},
    users : {type: [String]},
    private : {type: Boolean, default: false}, // false - 전체 채팅 (peer_id = "") , else - 개인 채팅 (peer_id != "")
    userId : { type: String, required: true },
    peerId : { type: String, required: true},
    content : { type: String, required: true},
    type : {type : String, required: true, default : "text"}, // type of chat ('text', 'image', 'file')
    createAt : { type: Date, default : Date.now()},
    sentCnt : { type: Number, default : 0}, // 메시지 받는이 수
    readCnt : { type: Number, default : 0}, // 메시지 읽은이 수
    upload : {type: Schema.Types.ObjectId, ref : 'File'} // File Schema
});

var model = mongoose.model('Chat', schema);

// make this available to our users in our Node applications
module.exports = model;