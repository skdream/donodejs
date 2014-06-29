/**
 * Created by skdream on 2014/6/29.
 */

var mongoose = require('mongoose');
var settings = require('../settings');

mongoose.connect(settings.db, function(err){
    if(err){
        console.error('connect to %s error',settings.db, err.message);
        process.exit(1);
    }
});


// models

require('./user');

exports.User = mongoose.model('User');

