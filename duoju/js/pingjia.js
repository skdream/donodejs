var $ = require('./jquery');
var template = require('./template-native');

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

var partyId = util.getParam('partyId'),
    lastId = 0,
    $evalTop = $('#evalTop'),
    $evaluationList = $("#evaluationList");

    //evaluationURL =  " http://jk.duoju.info/api/party/evaluation/list?partyId=" + partyId + "&lastId="+lastId;


function getEvaluation(){

    $.ajax({
        url: "http://jk.duoju.info/api/party/evaluation/list?partyId=" + partyId + "&lastId="+lastId,
        type: 'get',
        dataType: 'jsonp',
        jsonp:'callback',
        crossDomain: true,
        success:function(data){
            if(data.code ===1){
                var info = data.info;
                var list = info.evaluationList;
                if(lastId==0){
                    var evalHTML = template('evalTpl', info);
                    $evalTop.html(evalHTML);
                }


                if(list.length > 0){
                    lastId = list[list.length-1].id;
                    var evaluationListHTML = template('evaluationListTpl', info);
                    $evaluationList.append( evaluationListHTML );
                    if(list.length <10){
                        $('.load-more').hide();
                    }
                }else{
                     $('.load-more').hide();
                    $evaluationList.html('<div style="padding:50px;text-align:center"> 暂无评价...... </div> ');
                }
            }
        }
    });
}

$(function(){
    
    getEvaluation();
    $('.load-more').bind('touchstart',function(e){
        e.preventDefault();
        getEvaluation();
    })

});