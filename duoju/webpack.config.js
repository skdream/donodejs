'use strict';
// module.exports = {
//   entry: "./js",
//   output: {
//     path: __dirname + "/dist",
//     filename: "index.js"
//   }
// };





module.exports={
	entry:{
		index:"./js/index.js",
		comment:"./js/comment.js",
		pingjia:"./js/pingjia.js"
	},
	output:{
		path:__dirname + "/dist",
		filename:"[name].js"
	}
}

/*
module.exports={
	entry:{
		index:"./js/index.js",
		comment:"./js/comment.js"
	},
	output:{
		path:'dist',
		filename:"[name].js"
	},
	module:{
		loaders:[
		{test:/\.css$/, loader:"style!CSS"}
		]
	}
}
*/