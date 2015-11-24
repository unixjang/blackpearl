/**
 * Created by hyochan on 9/4/15.
 */
var mongoose = require('mongoose');
var appSet = require('../../../appSet');
var Schema = mongoose.Schema;

mongoose.createConnection(appSet.mongodbUrl + appSet.dbName);
var schema = new Schema({
    _id : {type: Number, default : 1}, // autoincrement
    ownerId : { type: String, required: true},
    boardgrpName : { type: String, required: true},
    writerId : { type: String, required: true},
    title : { type: String },
    content : { type: String },
    createAt : { type: Date, default : Date.now()},
    updateAt : { type: Date, default : Date.now()},
    readCnt : { type: Number, default : 0},
    secret : { type: Boolean, default : false},
    upload : {
        cnt : {type: Number, default : 0},
        files : {type : [Schema.Types.ObjectId], ref : 'File'} // File 스키마가 이 array에 들어감
    }
});

// unique key 조합 인덱싱
schema.index({'_id' : 1, "ownerId" : 1, "boardgrpName" : 1}, {unique : true});

var model = mongoose.model('Board', schema);

// make this available to our users in our Node applications
module.exports = model;