var $ = require('./jquery');
var template = require('./template-native');
var IScroll = require('./iscroll-probe');


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




    var myScroll=null;
        id = util.getParam('partyId'),
        lastId = util.getParam('lastId'),
        detailURL =  "http://jk.duoju.info/api/party/comment/list?partyId=" + id + "&lastId=" + lastId;

    function loaded(){
        myScroll = new IScroll('#wrapper',{
            probeType: 1,  //该值用于监听 scroll 事件，表示敏感程度 分别为 1,2,3级，最高3级，只有设置了 该值，scroll 事件才起作用 并且引用的是 iscroll-probe.js
            tap: 'myCustomTapEvent',//绑定自定义事件
            scrollbars: true,  // 设置为true时，开始对滚动条进行设置
            fadeScrollbars : true, //
            //snap: 'li'
            //startY : -50 //利用布局实现偏移
        });

        myScroll.on('scroll',function(){
            console.log('move');
            console.log('y:',this.y,'maxScrollY:',this.maxScrollY);
            var $wrapper = $(this.wrapper);
            var $pullDown = $wrapper.find('.pulldown');
            var $pullUp = $wrapper.find('.pullup');
            if(this.y>5){
                $pullDown.addClass('flip').find('.label').html('松开后刷新...');
            }else{
                $pullDown.removeClass('flip').find('.label').html('下拉刷新...');
            }

            if(this.maxScrollY - this.y >5){
                $pullUp.addClass('flip').find('.label').html('松开后刷新...');
            }else{
                $pullUp.removeClass('flip').find('.label').html('上拉刷新...');
            }
        });

        myScroll.on('scrollEnd',function(){
            console.log('scrollEnd',this);
            console.log('y:',this.y,'maxScrollY:',this.maxScrollY);
            var $wrapper = $(this.wrapper);
            var $pullDown = $wrapper.find('.pulldown');
            var $pullUp = $wrapper.find('.pullup');
            var data = null;

            if($pullDown.hasClass('flip')){
                $pullDown.removeClass('flip').addClass('loading').find('.label').html('加载中...');
                $wrapper.css('top',0);
                getData($wrapper,data,0);  // 0 表示下拉刷新
            }

            if($pullUp.hasClass('flip')){
                $pullUp.removeClass('flip').addClass('loading').find('.label').html('加载中...');
                getData($wrapper,data,1); // 1 表示上拉刷新
            }
        });
    }
    

    function getData($obj,data,direction){
         $.ajax({
            url:  "http://jk.duoju.info/api/party/comment/list?partyId=" + id + "&lastId=" + lastId,
            type: 'get',
            dataType: 'jsonp',
            jsonp:'callback',
            success:function(data){

                if(data.code ===1){
                    var info = data.info,
                        list = info.list,
                        commentHTML = "";
                        lastId = list[list.length-1].id;



                    if(!direction){
                        $obj.find('.pulldown').removeClass('loading').find('.label').html('松开后刷新...');
                        $obj.css('top',0);

                        renderHtml($obj, list,direction);
                       
                    }else{
                        $obj.find('.pullup').removeClass('loading').find('.label').html('松开后刷新...');

                        renderHtml($obj, list,direction);
                       
                    };
                }
            }
        });
    }


function dateFormat (mdate, from,to) {

  return mdate.substr(from,to);
}


function renderHtml(obj, res ,direction){
    $.each(res,function(index,item){
                var str = '<div class="comm-top">\
                            <span class="avatar">\
                                <img src="'+ item.user.smallAvatar +'" alt="'+ item.user.username +'">\
                            </span>\
                            <span class="uname">'+ item.user.username +'</span>\
                            <span class="time">'+ dateFormat(item.addTime,11,5) +'</span>\
                        </div>\
                        <div class="comm-con">'+ item.content +'</div>';
            if(!direction){
                obj.find('ul').prepend('<li class="item">'+str+'</li>')
            }else{
                obj.find('ul').append('<li class="item">'+str+'</li>')
            }

             myScroll.refresh();
        
    });
}










$(function(){
    
	var	$comment = $('#comment');
        $commentList = $('#commentList');
      
		


  //  loaded();


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
                    lastId = list[list.length-1].id;
    			if(list.length > 0){
    				commentHTML = template('commentTpl', info);
    				$commentList.html(commentHTML);
    			}else{
                    $comment.html('<div class="comment-bd" style="padding:50px;text-align:center"> 暂无评论...... </div> ');
                }

                setTimeout(function(){
                    loaded();
                }, 200);
                
    		}
        }
    });


});