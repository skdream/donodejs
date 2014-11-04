var user = require('../controllers/user');
var crawl = require('../controllers/crawl');
module.exports = function(app){
	app.get('/', function(req,res){
		res.render('index',{
			title:'myBlog',
			body:''
		});
	});

   app.get('/signup/',user.showSignup);
   app.post('/signup/',user.signup);
   app.get('/crawl/:id',function(req, res){

   		var pageId = req.params.id;
   		crawl.crawl(pageId,function(data){
   		
   			res.render('index',{
   				title:"crawl",
   				body:data
   			})
   		});
/*   	for (var i = 10 - 1; i >= 0; i--) {
   		crawl(i,function(data){
   			res.render('index',{
   				title:"crawl",
   				body:data
   			})
   		});
   	};*/

   });
};