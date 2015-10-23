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

/*template.helper('dateFormat', function (mdate, format) {

    var date = new Date(mdate);

    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});
*/


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
    }
}


$(function(){
    
	var id = util.getParam('partyId'),
		detailURL = "", // "http://jk.duoju.info/api/party/detail/" + id,
		detailId = "",
        url = document.location.href,
		$comment = $('#comment');
      
		detailURL =  "http://jk.duoju.info/api/party/comment/list?partyId=" + id + "&lastId=3";

	$.ajax({
        url: detailURL,
        type: 'get',
        dataType: 'jsonp',
        jsonp:'callback',
        success:function(data){
    		if(data.code ===1){
    			var info = data.info,
    				list = info.list,
    				commentHTML = "";
    			if(list.length > 0){
    				commentHTML = template('commentTpl', info);
    				$comment.html(commentHTML);
    			}
    		}
        }
	});
});