var $ = require('./jquery');
var template = require('./template-native');


/** 
 * 对日期进行格式化， 
 * @param date 要格式化的日期 
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有： 
 *     y:年, 
 *     M:年中的月份(1-12), 
 *     d:月份中的天(1-31), 
 *     h:小时(0-23), 
 *     m:分(0-59), 
 *     s:秒(0-59), 
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang
 * @see	http://yaniswang.com/frontend/2013/02/16/dateformat-performance/
 */
// template.helper('dateFormat', function (date, format) {

//     date = new Date(date);

//     var map = {
//         "M": date.getMonth() + 1, //月份 
//         "d": date.getDate(), //日 
//         "h": date.getHours(), //小时 
//         "m": date.getMinutes(), //分 
//         "s": date.getSeconds(), //秒 
//         "q": Math.floor((date.getMonth() + 3) / 3), //季度 
//         "S": date.getMilliseconds() //毫秒 
//     };
//     format = format.replace(/([yMdhmsqS])+/g, function(all, t){
//         var v = map[t];
//         if(v !== undefined){
//             if(all.length > 1){
//                 v = '0' + v;
//                 v = v.substr(v.length-2);
//             }
//             return v;
//         }
//         else if(t === 'y'){
//             return (date.getFullYear() + '').substr(4 - all.length);
//         }
//         return all;
//     });
//     return format;
// });


template.helper('dateFormat', function (mdate, from,to) {

  return mdate.substr(from,to);
});

var util = {
    
    getParam:function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if(results == null) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    },
    openApp : function (elem,url) {
        var btnOpenApp = document.getElementById(elem);
        btnOpenApp.onclick = function () {
            //打开本地应用函数
            var open=function(url){
                var timeout;     
                    function try_to_open_app() {
                        timeout = setTimeout(function(){
                        window.location.href=url;
                        //console.log(22)
                           }, 20);
                    }
                    try_to_open_app();
            }
     
            if (/android/i.test(navigator.userAgent)) {
                //alert(This is Android'browser.);//这是Android平台下浏览器
                if (/MicroMessenger/i.test(navigator.userAgent)) {
                    alert('请使用本地浏览器打开');//这是微信平台下浏览器
                }
                else {
                    open(url);
                }
            }
     
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                //alert(This is iOS'browser.);//这是iOS平台下浏览器
                if (/MicroMessenger/i.test(navigator.userAgent)) {
                    alert('微信内置浏览器不支持打开本地应用,请点击右上角使用本地浏览器打开');//这是微信平台下浏览器
                }
                else {
                    open(url);
                }
            }
        };
    }
}



$(function(){
    
	var id = util.getParam('id'),
        contentURL = "", // "http://jk.duoju.info/api/page/party/content/" + id +"#main",
		detailURL = "", // "http://jk.duoju.info/api/party/detail/" + id,
		detailId = "",
        url = document.location.href,
		$comment = $('#comment'),
		$good = $('#good'),
		$act   = $('#act'),
        $starBox = $('#starBox'),
		$price = $('#price'),
		$Jcover = $('#Jcover');
        
		detailURL =  "http://jk.duoju.info/api/party/detail/" + id;

      //  contentURL = "http://jk.duoju.info/api/page/party/content/?partyId=" + id;

	var infoWindow,
		map, 
		level = 14;


	// $('#article').load(contentURL);
/*
	$.ajax({
		url: contentURL,
		type: 'get',
		dataType: 'jsonp',
		jsonp:'callback',
		success:function(data){
			$('#article').html(data.info.party.content);
		}
	})
*/

	$.ajax({
		url: detailURL,
		type: 'get',
		dataType: 'jsonp',
		jsonp:'callback',
		success:function(data){

			if(data.code ===1){
				var info = data.info,
					party = info.party,
				    actHTML = template("actTpl",party),
					commentHTML = "",
					goodHTML = "";

				var coverStr = '<h3>'+ party.name +'</h3>';

				$Jcover.css({'background-image':'url('+party.cover+')'})
				$Jcover.html(coverStr);
				$act.html(actHTML);

				document.title = party.name;
				$('#article').html(party.content);

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
	            if(party.evaluationCount>0){
	                starHTML = template('starTpl', party);
					$starBox.html(starHTML);
	            }else{
	                $starBox.hide();
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
				   	offset: new AMap.Pixel(-12,52),
				   	size:new AMap.Size(300,0)
				   }); 
				}
				infoWindow.open(map, marker.getPosition());
				$price.html(party.priceRange)
			}
		}
	})
    
    util.openApp('downLoad',"http://a.app.qq.com/o/simple.jsp?pkgname=com.miqu.jufun");
    util.openApp('joinIn',"http://a.app.qq.com/o/simple.jsp?pkgname=com.miqu.jufun");
});