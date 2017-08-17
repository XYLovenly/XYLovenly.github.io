$(document).ready(function () {
    var channelsList = [];
    var allData = [];
    var chNos;
    $.ajax({
        url: "/getchannels",
        success:function (data) {
            if(data){
                allData = data;
                for(var i in data){
                    if (data.hasOwnProperty(i)){
                        channelsList.push(i);
                    }
                }
            }
        },
        error:function (error) {
            console.log(error);
        }
    });

    //搜索
    function inClck(input,cDiv,dDiv,arr,e,index) {
        e.stopPropagation();
        cDiv.empty().slideDown("slow");
        cDiv.slideDown("slow");
        dDiv.slideUp("slow");
        var nArr = new Array;
        switch (index){
            case 1:
                for (var i in arr){
                    cDiv.append("<p>"+arr[i]+"</p>");
                };
                nArr = arr;
                break;
            case 2:
                var dateArr = [];
                for(var i in arr){
                    if(i == chNos){
                        for (var j in arr[i]){
                            cDiv.append("<p>"+arr[i][j]+"</p>");
                            dateArr.push(allData[i][j]);
                        }
                    }
                };
                nArr = dateArr;
                break;
        }
        fuzzyQuery(input,cDiv,nArr);
    };
    //模糊查询
    function fuzzyQuery(btn,seDiv,arr) {
        btn.on("input" ,function() {
            seDiv.empty();
            for (var i =0; i<arr.length;i++) {
                if (arr[i].toLowerCase().indexOf($(this).val().toLowerCase()) !== -1) {
                    seDiv.append("<p>"+arr[i]+"</p>");
                }
            }
            if(!$(this).val()){
                seDiv.empty();
                for(var i in arr){
                    seDiv.append("<p>"+arr[i]+"</p>");
                }
            }
        })
    };
    //点击p
    function pClick(cInput,ss,p,e) {
        e.stopPropagation();
        cInput.val(p.html());
        if(ss){
            ss.show();
        };
        p.parent().slideUp("slow");
    };

    //一级
    $(".chnlsNameText").on("click",function (e){
        inClck($(this),$(".channelListDiv"),$(".dateListDiv"),channelsList,e,1);
    });
    //二级
    $(".chnlsDateText").on("click",function (e) {
        inClck($(this),$(".dateListDiv"),$(".channelListDiv"),allData,e,2);
    });

    $(".channelListDiv").on("click","p",function (e) {
        pClick($(".chnlsNameText"),$(".SecSearch"),$(this),e)
        chNos = $(this).html();
    });
    $(".dateListDiv").on("click","p",function (e) {
        pClick($(".chnlsDateText"),null,$(this),e);
    });

    //点击任意取消
    $("html").click(function () {
        $(".channelListDiv").slideUp("slow");
        $(".dateListDiv").slideUp("slow");
    });
    //查询节目单
    $(".searchChanls").click(function () {
        if($(".chnlsNameText").val()&&$(".chnlsDateText").val()) {
            window.location.href = "/getepg/" + encodeURIComponent($(".chnlsNameText").val()) + "/" + $(".chnlsDateText").val();
        }else {
            alert("无");
        }
    });
    var num = 0;
    $(document).keydown(function(event){

        if($(".channelListDiv").css("display")=="block"){
            $(".channelListDiv").children("p").eq(0).css({"background":"#f5f5f5"}).focus();

        if(event.keyCode == 38){
            num--;
            if(num < 0){
                num = $(".channelListDiv").children("p").length;
            }
            for(var i in $(".channelListDiv").children("p")){
                $(".channelListDiv").children("p").eq(i).css({"background":"#fff"}).blur();
            }
            $(".channelListDiv").children("p").eq(num).css({"background":"#f5f5f5"}).focus();
        }else if (event.keyCode == 40){
            num++;
            if(num > $(".channelListDiv").children("p").length){
                num = 0;
            }

            for(var i in $(".channelListDiv").children("p")){
                $(".channelListDiv").children("p").eq(i).css({"background":"#fff"}).blur();
            }
            $(".channelListDiv").children("p").eq(num).css({"background":"#f5f5f5"}).focus();
        }
        }
    });
})