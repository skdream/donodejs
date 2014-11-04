var http = require('http'),
	fs   = require('fs'),
	cheerio = require('cheerio');

function pickHtml(doc, callback){
	var $ = cheerio.load(doc);
	var arr = [], len = $('.joke_li').length;
	$('.joke_li').each(function(i,elemObj){
		var $this = $(this);
		//console.log($this);
		var obj = {};
		obj.summary = $this.find('.para_can').html();
		arr.push(obj);
		if( +i + 1 == len){
			callback && callback(arr);
		}
	});
}

function crawl(pagenum, callback){
	var options = {
		  hostname: 'lengxiaohua.com.cn',
		  port: 80
		  ,path: '/?page_num=' + pagenum
		  //,method: 'get'
		  //,headers:{"User-Agent":"Mozilla\/5.0 (Windows NT 6.1; WOW64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/38.0.2125.111 Safari\/537.36"}
		};
	var url = 'http://lengxiaohua.com.cn/page_num?'+pagenum;

	http.get(options,function(res){
		var html = '';
		res.setEncoding('utf8');
		res.on('data',function(data){
			html += data
		}).on('end',function(){
			//console.log(html);
			pickHtml(html,function(arr){
				//console.log(html);
				callback && callback(arr);
			})
		})
	}).on('error',function(e){
		console.log("Got error: " + e.message);
	})
}
exports.crawl = crawl;