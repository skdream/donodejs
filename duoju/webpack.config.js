'use strict';
module.exports = {
  entry: "./js",
  output: {
    path: __dirname + "/dist",
    filename: "index.js"
  }
};

/*
module.exports={
	entry:{
		bundle:"./entry.js",
		feed:"./feed.js"
	},
	output:{
		path:'build',
		filename:"[name].js"
	},
	module:{
		loaders:[
		{test:/\.css$/, loader:"style!CSS"}
		]
	}
}
*/