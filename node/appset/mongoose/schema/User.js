/**
 * Created by hyochan on 8/18/15.
 */
var mongoose = require('mongoose');
var appSet = require('../../../appSet');
var Schema = mongoose.Schema;

mongoose.createConnection(appSet.mongodbUrl + appSet.dbName);
var schema = new Schema({
    id: { type: String, required: true, unique: true },
    pw: { type: String, required: true },
    img : { type : String, required: true}, // 추가
    name: { type: String, required: true},
    phone: { type: String}, // Client 쪽에서는 예외를 줄이기위해 Number로 받는다 (디비를 Number로 할 때 010이 10으로 저장되는 현상이 있음)
    email: { type: String, required: true},
    createAt: { type: Date, default : Date.now()},
    updateAt: { type: Date, default : Date.now()},
    login : {type: Boolean, default : false},
    setting :
    {
        autoLogin : {type : Boolean, default : false},
        secret : {type : Boolean, default : false}
    }
});

// on every save, add the date
/*userSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at){
        this.created_at = currentDate;
        this.setting.auto_login = true;
        this.setting.allow_myinfo = true;
    }

    next();
});*/

// the schema is useless so far
// we need to create a model using it

// 아래 정의한 'User'는 몽고디비에서 users 콜랙션으로 저장된다.
var model = mongoose.model('User', schema);

// make this available to our users in our Node applications
module.exports = model;