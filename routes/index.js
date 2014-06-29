var user = require('../controllers/user');
module.exports = function(app){
	app.get('/', function(req,res){
		res.render('index',{
			title:'myBlog'	
		});
	});

   app.get('/signup/',user.showSignup);
   app.post('/signup/',user.signup);

};