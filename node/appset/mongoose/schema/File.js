/**
 * Created by hyochan on 9/4/15.
 */
var mongoose = require('mongoose');
var appSet = require('../../../appSet');
var Schema = mongoose.Schema;

mongoose.createConnection(appSet.mongodbUrl + appSet.dbName);
var schema = new Schema({
    name : { type: String, required: true, unique: true },
    type : { type: String, required: true },
    size : { type: Number, required: true},
    extension : { type: String, required: true}
});

var model = mongoose.model('File', schema);

// make this available to our users in our Node applications
module.exports = model;