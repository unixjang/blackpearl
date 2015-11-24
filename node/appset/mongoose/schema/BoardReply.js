/**
 * Created by hyochan on 9/4/15.
 */
var mongoose = require('mongoose');
var appSet = require('../../../appSet');
var Schema = mongoose.Schema;

mongoose.createConnection(appSet.mongodbUrl + appSet.dbName);
var schema = new Schema({
    _id: { type: Number, default: 1, required: true}, // autoincrement
    board_id : { type: Number, required:true},
    ownerId : { type: String, required: true},
    boardgrpName : { type: String, required: true},
    userId : { type: String, required: true},
    content : { type: String, required: true},
    createAt: { type: Date, default : Date.now()},
    secret : { type : Boolean, default : false}
});

schema.index({'_id' : 1, 'board_id' : 1, "ownerId" : 1, "boardgrpName" : 1}, {unique : true});

var model = mongoose.model('BoardReply', schema);

// make this available to our users in our Node applications
module.exports = model;