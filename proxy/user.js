/**
 * Created by skdream on 2014/6/29.
 */
var models = require('../models');
var User = models.User;

exports.addNewUser = function(name, loginName, pass ,email, avatar, active, callback){
    var user = new User();
    user.name = name;
    user.loginName = loginName;
    user.pass = pass;
    user.email = email;
    user.avatar = avatar;
    user.active = active;
    user.save(callback);
};