/**
 * Created by skdream on 2014/6/29.
 */
var User = require('../proxy').User;
var settins = require('../settings');
var crypto = require('crypto');

exports.showSignup = function(req, res){
    res.render('sign/signup',{title:'注册'});
};
exports.signup = function(req, res, next){
    var name = req.body.name,
        loginName= req.body.loginName,
        pass = req.body.pass,
        email = req.body.email;
    User.addNewUser(name,loginName,pass,email,'',false,function(err){
        if(err){
            return next(err);
        }
        res.render('sign/signup',{title:'注册',success: '欢迎加入 ' + settins.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'});
    })
};
