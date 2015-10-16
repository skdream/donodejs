var $ = require('./jquery');
var template = require('./template');

$(function(){

	var contentURL = "./data/content.html #main", //http://jk.duoju.info/api/party/detail/107343
		detailURL = "./data/detail.json", // http://jk.duoju.info/api/party/detail/107343
		detailId = "",
		$comment = $('#comment'),
		$good = $('#good'),
		$act   = $('#act'),
		$price = $('#price');

	var infoWindow,
		map, 
		level = 14;
	$('#article').load(contentURL);

	$.getJSON(detailURL,function(data){
		if(data.code ===1){
			console.log(data);
			var info = data.info,
				party = info.party,
			    actHTML = template("actTpl",party),
				commentHTML = "",
				goodHTML = "";

			$act.html(actHTML);

			if(party.goodCount>0){
				goodHTML= template("goodTpl",party);
				$good.html(goodHTML);
			}else{
				$good.hide();
			}

			if(party.commentCount > 0){
				commentHTML = template('commentTpl', party);
				$comment.html(commentHTML);
			}else{
				$comment.hide();
			}

		    var mapData = {
		    	type: "Marker", 
			    name: "name", 
			    desc: "desc", 
			    // color: "red",
			    // icon: "cir", 
			    offset: {x: -9, y: -31},
			    lnglat: {lng: party.longitude, lat: party.latitude}
		 	};

			 map = new AMap.Map("mapContainer", {
				center: new AMap.LngLat(mapData.lnglat.lng, mapData.lnglat.lat),
				level: level,
				keyboardEnable: false,
				dragEnable: false,
				scrollWheel: false,
				doubleClickZoom: false
			});


			var marker = new AMap.Marker({
				map: map,
				position: new AMap.LngLat(mapData.lnglat.lng, mapData.lnglat.lat),
				zIndex: 3,
				extData: mapData, 
				offset: new AMap.Pixel(mapData.offset.x, mapData.offset.y), 
				title: mapData.name,
				content: '<div class="marker-con"><div class="icon icon-cir"></div><div class="shadow"></div></div>'
				
			});


			if(!infoWindow){
			   infoWindow = new AMap.InfoWindow({
			   	isCustom:true,
			   	autoMove: true,
			   	content:'<div class="place">'+ party.place+'</div>',
			   	offset: new AMap.Pixel(-10,80),
			   	size:new AMap.Size(300,0)
			   }); 
			}
			  
			infoWindow.open(map, marker.getPosition());

			$price.html(party.priceRange)
		}
	});
});