/**
 * Created by hyochan on 9/4/15.
 */
var mongoose = require('mongoose');
var appSet = require('../../../appSet');
var Schema = mongoose.Schema;

mongoose.createConnection(appSet.mongodbUrl + appSet.dbName);
var schema = new Schema({
    name : { type: String, required: true},
    users : {type: [String], required:true, unique : true},
    cnt : {type: Number, default: 1},
    createAt : { type: Date, default : Date.now()}
});

var model = mongoose.model('ChatGrp', schema);

// make this available to our users in our Node applications
module.exports = model;