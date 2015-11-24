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
    name : { type: String, required: true},
    cnt : { type: String, default: 0},
    createAt : { type: Date, default : Date.now()},
    secret : { type: Boolean, default: false},
    permission : { type: String, default: "r/w"} // r/w, r, w
});

// unique key 조합 인덱싱
schema.index({"ownerId" : 1, 'name' : 1}, {unique : true});

var model = mongoose.model('BoardGrp', schema);

// make this available to our users in our Node applications
module.exports = model;