
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash'); //https://github.com/jaredhanson/connect-flash
var settings = require('./settings');

var fs = require('fs');
var accesslog = fs.createWriteStream('access.log', {flag: 'a'});
var errorlog = fs.createWriteStream('error.log', {flag:'a'});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.logger({stream:accesslog}));

app.use(express.json());
app.use(express.urlencoded());
//app.use(require('method-override')());
app.use(require('method-override')());
app.use(express.cookieParser(settings.cookieSecret));
app.use(express.session({
	secret: settings.cookieSecret, // session cookie is signed with this secret to prevent tampering
	key: settings.db_name, // cookie name defaulting to connect.sid
	cookie:{maxAge: 1000 * 60 * 60 * 24 *30}, //30 days
	store: new MongoStore({
		db:settings.db_name
	})
}));
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next){
	var meta = '['+ new Date() + ']' + req.url + '\n';
	errorlog.write(meta, err.stack + '\n');
	next();
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);