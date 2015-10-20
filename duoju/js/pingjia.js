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



$(function(){
    
    var id = util.getParam('partyId'),
        detailURL = "", // "http://jk.duoju.info/api/party/detail/" + id,
        detailId = "",
        url = document.location.href,
        $evalTop = $('#evalTop'),
        $evaluationList = $("#evaluationList");
        
    if(url.indexOf('duoju')>-1){
      
        detailURL =  " http://jk.duoju.info/api/party/evaluation/list?partyId=" + id + "+&lastId=0";
    }else{
     
        detailURL = "./data/ping.txt";
    }

    var infoWindow,
        map, 
        level = 14;

    $.getJSON(detailURL,function(data){
        if(data.code ===1){
            var info = data.info,
                evalHTML = "";
        
                evalHTML = template('evalTpl', info);
                $evalTop.html(evalHTML);
            var evaluationListHTML = template('evaluationListTpl', info);
            $evaluationList.html( evaluationListHTML );

        }
    });
});