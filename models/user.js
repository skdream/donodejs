/**
 * Created by skdream on 2014/6/29.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name:{type:String},
    loginName:{type:String},
    pass:{type:String},
    email:{type:String},
    url:{type:String},
    avatar:{type:String},
    location:{type:String},
    signature:{type:String},
    profile:{type:String},
    weibo:{type:String},
    githubId:{type:String},
    githubUsername:{type:String}
});
UserSchema.index({name:1});
UserSchema.index({loginName:1},{unique:true});
UserSchema.index({email:1},{unique:true});
UserSchema.index({githubId:1});

mongoose.model('User',UserSchema);
