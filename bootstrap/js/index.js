//框拖拽
var Sys = (function(ua){
    var s = {};
    s.IE = ua.match(/msie ([\d.]+)/)?true:false;
    s.Firefox = ua.match(/firefox\/([\d.]+)/)?true:false;
    s.Chrome = ua.match(/chrome\/([\d.]+)/)?true:false;
    s.IE6 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6))?true:false;
    s.IE7 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7))?true:false;
    s.IE8 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8))?true:false;
    return s;
})(navigator.userAgent.toLowerCase());
var $id = function (id) {
    return document.getElementById(id);
};
var Css = function(e,o){
    for(var i in o)
        e.style[i] = o[i];
};

var Bind = function(object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function() {
        return fun.apply(object, args);
    }
};
var BindAsEventListener = function(object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function(event) {
        return fun.apply(object, [event || window.event].concat(args));
    }
};
var CurrentStyle = function(element){
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
};

function addListener(element,e,fn){
    element.addEventListener?element.addEventListener(e,fn,false):element.attachEvent("on" + e,fn);
};

function removeListener(element,e,fn){
    element.removeEventListener?element.removeEventListener(e,fn,false):element.detachEvent("on" + e,fn)
};

var Class = function(properties){
    var _class = function(){
        return (arguments[0] !== null && this.initialize && typeof(this.initialize) == 'function')
            ? this.initialize.apply(this, arguments) : this;
    };
    _class.prototype = properties;
    return _class;
};
var Resize =new Class({
    initialize : function(obj){
        this.obj = obj;
        this.resizeelm = null;
        this.fun = null; //记录触发什么事件的索引
        this.original = []; //记录开始状态的数组
        this.width = null;
        this.height = null;
        this.fR = BindAsEventListener(this,this.resize);
        this.fF = Bind(this,this.stop);
    },
    set : function(elm,direction){
        if(!elm)return;
        this.resizeelm = elm;
        addListener(this.resizeelm,'mousedown',BindAsEventListener(this, this.start, this[direction]));
        return this;
    },
    start : function(e,fun){
        this.fun = fun;
        this.original = [parseInt(CurrentStyle(this.obj).width),
            parseInt(CurrentStyle(this.obj).height),
            parseInt(CurrentStyle(this.obj).left),
            parseInt(CurrentStyle(this.obj).top)
        ];
        this.width = (this.original[2]||0) + this.original[0];
        this.height = (this.original[3]||0) + this.original[1];
        addListener(document,"mousemove",this.fR);
        addListener(document,'mouseup',this.fF);
    },
    resize : function(e){
        this.fun(e);
        Sys.IE?(this.resizeelm.onlosecapture=function(){this.fF()}):(this.resizeelm.onblur=function(){this.fF()})
    },
    stop : function(){
        removeListener(document, "mousemove", this.fR);
        removeListener(document, "mousemove", this.fF);
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },
    left : function(e){
        e.clientX<this.width?
            Css(this.obj,{left:e.clientX +'px',width:this.width-e.clientX + "px"}):this.turnRight(e);
        $id('topTit').style.left = $id('wraper').offsetLeft;
    },
    right : function(e){
        e.clientX>this.original[2]?
            Css(this.obj,{left:this.original[2]+'px',width:e.clientX-this.original[2]+"px"}):this.turnLeft(e);
    },
    turnRight : function(e){
        Css(this.obj,{left:this.width+'px',width:e.clientX- this.width +'px'});
    },
    turnLeft : function(e){
        Css(this.obj,{left:e.clientX +'px',width:this.original[2]-e.clientX+'px'});
    }
});

$(document).ready(function () {

    new Resize($id('wraper')).set($id('leftLine'),'left').set($id('rightLine'),'right');

    $(".channels").on("click",function () {
        sessionStorage.index = $(this).index();
        $(".MsgDetails").html("");
        var channelName = $(this).find(".RightContent").children("p").eq(0).html();
        $.ajax({
            url: "/geterr/"+encodeURIComponent(channelName),
            success:function (data) {
                if(data){
                    if(data.length == 0){
                        /* var div = `<div class="channelMsg">
                         <p class="chName">${channelName}</p>
                         <p>此节目单正确</p>
                         </div>	`;*/
                        var div = '<div class="channelMsg"><p class="chName">'+channelName+'</p>'+
                            '<p>此节目单正确</p></div>';
                        $(".MsgDetails").append(div);
                    }else {
                        //var chlDiv = `<div class="chName">${channelName}</div>`;
                        var chlDiv = '<div class="chName">'+channelName+'</div>';
                        $(".MsgDetails").append(chlDiv);
                        for( var i in data) {
                            /*var div = `
                             <div class="channelMsg">
                             <p><span>日期：</span><span>${data[i].dateTime}</span></p>
                             <p><span>错误：</span><span>${data[i].errorData.length}</span></p>
                             <div class="chDetails"></div>
                             </div>`;*/
                            var div = '<div class="channelMsg"><p><span>日期：</span><span>'+data[i].dateTime+'</span></p>'+
                                '<p><span>错误：</span><span>'+data[i].errorData.length+'</span></p><div class="chDetails"></div> </div>';
                            $(".MsgDetails").append(div);
                        }
                        if($(".chDetails")){
                            for (var i in data[0].errorData){
                                //var p =`<p><span>${data[0].errorData[i].epgField}</span><span>${data[0].errorData[i].errorType}</span></p>`;
                                var p ='<p><span>'+data[0].errorData[i].epgField+'</span><span>'+data[0].errorData[i].errorType+'</span></p>';
                                $(".chDetails").append(p);
                            }
                        }
                        $(".chDetails p").on("click",function () {
                            window.open("/getepg/"+encodeURIComponent(channelName)+"/"+$(this).parent().parent().find("p:first-child").children("span").eq(1).html());
                            //window.location.href = "/getepg/"+encodeURIComponent(channelName)+"/"+$(this).parent().parent().find("p:first-child").children("span").eq(1).html();
                        })
                    }
                }else {
                    /* var div = `<div class="channelMsg">
                     <p class="chName">${channelName}</p>
                     <p>无对比节目单</p>
                     </div>	`;*/
                    var div = '<div class="channelMsg"><p class="chName">'+channelName+'</p> <p>无对比节目单</p> </div>';
                    $(".MsgDetails").append(div);
                }
            },
            error:function (error) {
                console.log(error);
            }
        });
    });
    $(".top span").on("click",function () {
        window.location.reload();
    })
    if(sessionStorage.index){
        $(".channels").eq(sessionStorage.index).click();
    }
});