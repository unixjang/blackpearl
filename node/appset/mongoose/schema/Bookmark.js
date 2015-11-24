/**
 * Created by hyochan on 9/15/15.
 */
var mongoose = require('mongoose');
var appSet = require('../../../appSet');
var Schema = mongoose.Schema;

mongoose.createConnection(appSet.mongodbUrl + appSet.dbName);
var schema = new Schema({
    id: { type: String, required: true },
    bookmark: { type: String, required: true},
    reqAt: { type: Date, required: true, default : Date.now()}
});

// unique key 조합 인덱싱
schema.index({'id' : 1, 'bookmark' : 1}, {unique : true});

var model = mongoose.model('Bookmark', schema);

// make this available to our users in our Node applications
module.exports = model;