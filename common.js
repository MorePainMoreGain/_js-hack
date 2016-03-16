/**
 * # 描述
 * common公用模块
 *
 * **使用范例**：
 *
 *     @example
 *     var common = require('common');
 *     common.isIE();
 * @class common
 * */
define(function(require, exports, module) {
    $ = jQuery =  require('jquery');
    require('layer').config({
        path: MD.layerDir,
        skin:'layer-ext-md',
        extend:'skin/md/style.css'
    });
    /**
     * layer加载插件引用内存
     * @type int
     * */
    exports.loadingIndex=null;
    exports.statusCode={
        404: function(){
            if(exports.loadingIndex){
                layer.close(exports.loadingIndex);
            }
            layer.alert('<p class="cRed">找不到请求路径</p>',{title:"系统出错",icon:0});
        },
        500:function(){
            if(exports.loadingIndex){
                layer.close(exports.loadingIndex);
            }
            layer.alert('<p class="cRed">500错误</p>',{title:"系统出错",icon:0});
        }
    };
    exports.error=function(jqXHR,textStatus,errorThrown){
        if(exports.loadingIndex){
            layer.close(exports.loadingIndex);
        }
        layer.alert('<p class="cRed">'+errorThrown+'</p>',{title:"系统出错",icon:0});
    };

    /**
     * 异步操作登录超时处理(用于拦截器的页面)
     * @param {function}  [callback]
     * 当无回调时，默认关闭后刷新页面
     */
    exports.ajaxSessionTimeout = function(callback){
        $(document).ajaxError(function(event, xhr, opt, error){
            var loginMarkReg=/<title>.*?登录.*?<\/title>/;
            if(loginMarkReg.test(xhr.responseText)){
                layer.alert('<p class="cRed">登录超时</p>',{title:"温馨提示",icon:0,end:function(){
                    if(typeof callback == "function"){
                        callback(opt);
                    }else{
                        //刷新页面
                        window.location.reload();
                    }
                }});
            }
        });
    };
    /**
     * 标识当前页状态
     * 作用：主要用于网站的导航当前页标识，通用索引项
     * @param {$} $obj 父对象
     * @param {String} subTag 子标签名
     * @param {Number} index 当前所在的索引位置
     * @param {String} [className="current"]
     * 选中样式名｜默认为“current”。
     * */
    exports.markCurrentStatus = function($obj,subTag,index,className){
        var _className=className || "current";
        if($obj.attr("data-type")=="unFixed"){
            $obj.find('[data-id="'+index+'"]').addClass(_className);
        }else{
            $obj.find(subTag).eq(index).addClass(_className);
        }
    };
    /**
     * 判断是否为IE
     * @return {Number} 返回IE版本（6-9），其他返回-1
     * */
    exports.isIE=function(){
        if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/6./i)=="6."){
            return 6
        }else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7."){
            return 7
        }else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8."){
            return 8
        }else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."){
            return 9
        }
        return -1;
    };
    /**
     * 跨浏览器placeHolder
     * 对于不支持原生placeHolder的浏览器，通过value或插入span元素两种方案模拟
     * @param {Object} obj 要应用placeHolder的表单元素对象
     * @param {Boolean} span 是否采用悬浮的span元素方式来模拟placeHolder，默认值false,默认使用value方式模拟
     * */
    exports.placeHolder =function(obj,span){
        if (!obj.getAttribute('placeholder') && exports.isIE()>9) return;
        var imitateMode = span===true?true:false;
        var supportPlaceholder = 'placeholder' in document.createElement('input');
        if (!supportPlaceholder) {
            var defaultValue = obj.getAttribute('placeholder');
            var type = obj.getAttribute('type');
            if (!imitateMode) {
                obj.onfocus = function () {
                    (obj.value == defaultValue) && (obj.value = '');
                    obj.style.color = '';
                }
                obj.onblur = function () {
                    if (obj.value == defaultValue) {
                        obj.style.color = '';
                    } else if (obj.value == '') {
                        obj.value = defaultValue;
                        obj.style.color = '#ACA899';
                    }
                }
                obj.onblur();
            } else {
                var placeHolderCont = document.createTextNode(defaultValue);
                var oWrapper = document.createElement('span');
                var width=(obj.offsetWidth - parseInt((getStyle(obj, 'marginLeft')=="auto"?0:(getStyle(obj, 'marginLeft')))))==0?100:(obj.offsetWidth - parseInt((getStyle(obj, 'marginLeft')=="auto"?0:(getStyle(obj, 'marginLeft'))))) + 'px';
                oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
                oWrapper.className = 'wrap-placeholder';
                oWrapper.style.fontFamily = getStyle(obj, 'fontFamily');
                oWrapper.style.fontSize = getStyle(obj, 'fontSize');
                oWrapper.style.marginLeft = parseInt(getStyle(obj, 'marginLeft')) ? parseInt(getStyle(obj, 'marginLeft')) + 3 + 'px' : 3 + 'px';
                oWrapper.style.marginTop = parseInt(getStyle(obj, 'marginTop'))!=0 ? getStyle(obj, 'marginTop'): 0 + 'px';
                oWrapper.style.paddingLeft = getStyle(obj, 'paddingLeft');
                $(oWrapper).css('width',width)
                oWrapper.style.height = obj.offsetHeight==0?34:obj.offsetHeight + 'px';
                oWrapper.style.lineHeight = obj.nodeName.toLowerCase()=='textarea'? '':(obj.offsetHeight==0?34:obj.offsetHeight) + 'px';
                oWrapper.appendChild(placeHolderCont);
                obj.parentNode.insertBefore(oWrapper, obj);
                oWrapper.onclick = function () {
                    obj.focus();
                };
                //绑定input或onpropertychange事件,ie9中删除时无法触发此事件
                if (typeof(obj.oninput)=='object') {//oninput是onpropertychange的非IE浏览器版本，支持firefox和opera等浏览器，但有一点不同，它绑定于对象时，并非该对象所有属性改变都能触发事件，据我所知，它只在对象value值发生改变时奏效。测试代码如下：
                    obj.addEventListener("input", changeHandler, false);
                    obj.onpropertychange = changeHandler;
                    obj.onkeyup = delHandler;
                } else {
                    obj.onpropertychange = changeHandler;//onpropertychange的话，只要当前对象属性发生改变，都会触发事件，因此用途更为广泛，只可惜它是IE only；
                    obj.onkeyup = delHandler;
                    obj.onkeyup = changeHandler;
                }
                function changeHandler() {
                    oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
                }
                function delHandler(e){//监听del、backspace、ctrl+x
                    var e = e || window.event;
                    if(e.keyCode == 8 || e.keyCode == 46 || (event.ctrlKey&&e.keyCode == 88) || (event.ctrlKey&&e.keyCode == 86) ){//8==keyCode,46==delete,88==x,ctrlKey:检查ctrl键的状态,当ctrl键按下时，值为True否则为False,只读
                        oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
                    }
                }
                /**
                 * 获取样式
                 * @param {Object} obj 要获取样式的对象
                 * @param {String} styleName 要获取的样式名
                 * */
                function getStyle(obj, styleName) {
                    var oStyle = null;
                    if (obj.currentStyle)
                        oStyle = obj.currentStyle[styleName];
                    else if (window.getComputedStyle)
                        oStyle = window.getComputedStyle(obj, null)[styleName];
                    return oStyle;
                }
            }
        }
    };
    /**
     * placeholder IE9及以下调用入口
     */
    exports.ieTo_placeholder = function(){
        if (exports.isIE()>9) return;
        $(':input[placeholder],textarea[placeholder]').each(function(index,element){
            exports.placeHolder(element,true);
        });
    };
    exports.str={
        //
        dTrim : function(s){
            if(s!=null && s!="") {
                return s.replace(/(^\n+)|(\n+$)|(^\s*)|(\s*$)|(^　*)|(　*$)/g,"");
            }else{
                return "";
            }
        },
        //url参数转json
        par2Json:function(string, overwrite){
            var obj = {};
            var pairs = string.split('&');
            var d = decodeURIComponent;
            var name,value;
            $.each(pairs, function(i,pair) {
                pair = pair.split('=');
                name = d(pair[0]);
                value = d(pair[1]);
                obj[name] = overwrite || !obj[name] ? value : [].concat(obj[name]).concat(value);
            });
            return obj;
        },
        len : function(str,type){
            var Length=0;
            if(arguments.length>0){
                if(type==2){
                    for(var i=0;i<str.length;i++){
                        Length = Length + (str.charCodeAt(i)>128?2:1);//一个中文字算二,一个英文字算一
                    }
                }else{
                    for(var i=0;i<str.length;i++){
                        Length = Length + (str.charCodeAt(i)>128?1:0.5);//一个中文字算一,两个英文字算一
                    }
                }
                return Math.ceil(Length);//有半个字要+1
            }else{
                return null;
            }
        }
    };
    /**
     * tab 选项卡
     * @param {$} $tabNavItem 选项卡导航集合
     * @param {$} $tabContItem 选项卡内容集合
     * @param {String} currentClass 选项卡当前导航样式名称
     * @param {String} [eTyep="mouseover"] 事件，默认为鼠标经过“mouseover”，可以为“click”事件
     * @example
     *      common.tab($("#tab_1 .tabBar a"),$("#tab_1 .cont"),"current","click");
     * */
    exports.tab = function($tabNavItem,$tabContItem,currentClass,eTyep){
        var _eType=eTyep || "mouseover";
        var fn=function(){
            $tabNavItem.on(_eType,function(){
                $tabNavItem.removeClass(currentClass);
                $tabContItem.hide();
                $(this).addClass(currentClass);
                $tabContItem.eq($(this).index()).show();
                return false;
            });
        };
        if(_eType=="mouseover"){
            var t=setTimeout(fn,100);
            clearTimeout(this.t);
        }else{
            fn();
        }
    };
    //url,data,callback
    exports.ajaxHandle=function(options){
        var defaults={
            type:"post",
            url:'',
            data:null,
            dataType:"json",
            $btn:null,
            callback:null
        };
        var opts=$.extend(defaults ,options);
        var url=opts.url;
        url += url.indexOf("?") == -1 ? "?" : "&";
        url += "t=" + new Date().getTime();
        var request = $.ajax({
            type:opts.type,
            url:url,
            data:opts.data,
            dataType:opts.dataType
        });
        request.done(function(data){
            if(opts.$btn){
                opts.$btn.prop("disabled",true);
            }
            if(data.succ){
                if(typeof opts.callback == "function"){
                    opts.callback(data);
                }else {
                    layer.msg(data.msg,{icon:1},function(){
                        window.location.reload();
                    });
                }
            }else{
                layer.alert('<p class="cRed">'+data.msg+'</p>',{title:"温馨提示",icon:0});
                if(opts.$btn) {
                    opts.$btn.prop("disabled", false);
                }
            }
        });
        request.fail(function(jqXHR,textStatus,errorThrown){
            if(exports.loadingIndex){
                layer.close(exports.loadingIndex);
            }
            layer.alert('<p class="cRed">'+errorThrown+'</p>',{title:"系统出错",icon:0});
            if(opts.$btn) {
                opts.$btn.prop("disabled", false);
            }
        });
        return request;
    };

    /**
     * 功能：页面HTML加载
     * @url 页面url
     * @data 搜索参数序列化对象
     * @$pageListPanel 页面HTML容器，默认为$("#htmlContainer")
     */
    exports.loadPageHTML = function(url,data,$pageListPanel,isLoading) {
        var _url=url;
        _url += url.indexOf("?") == -1 ? "?" : "&";
        _url += "t=" + new Date().getTime();
        var $panel = $pageListPanel || $("#htmlContainer");
        var _isLoading= isLoading == null?true:isLoading;
        //$panel.html($("<img src='/static/img/sys/loading.gif'/>")
        //.css({position:"relative",left:($panel.width()-150)/2,top:200}));
        //$.jBox.tip("数据加载中...请稍候...", "loading");
        $.ajax({
            type: "POST",
            url: _url,
            data:data,
            dataType: "html",
            statusCode:exports.statusCode,
            beforeSend:function(){
                if(_isLoading){
                    exports.loadingIndex=layer.load();
                }
            },
            success:function(html){
                if(exports.loadingIndex){
                    layer.close(exports.loadingIndex);
                }
                $panel.html(html);
            },
            error:exports.error
        });
    }
    exports.clickPageFn=function(url,data,$pageListPanel,isLoading){
        $pageListPanel.on('click','.pages a',function(){
            var pn=$(this).data("id");
            var p = url.indexOf("?") == -1 ? "?" : "&";
            var _url=url+p+'pageNo='+pn;
            exports.loadPageHTML(_url,data,$pageListPanel,isLoading);
            return false;
        });
    };

    //导出功能
    exports.exportFn=function(url,data){
        data=decodeURIComponent(data,true);
        // 获得url和data
        if( url && data ){
            // data 是 string 或者 array/object
            data = typeof data == 'string' ? data : $.param(data);
            // 把参数组装成 form的  input
            var inputs = '';
            $.each(data.split('&'), function(){
                var pair = this.split('=');
                inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
            });
            // request发送请求
            $('<form action="'+ url +'" method="post">'+inputs+'</form>').appendTo('body').submit().remove();
        };
    };

    /**
     * 幻灯焦点广告
     * @param {$} $obj 幻灯广告对象
     * @param {String} [speed="slow"] 幻灯广告切换速度
     * @param {String} [autoTime=3000] 幻灯广告停留时间
     * @example
     *      common.focusSlide($("#focusSlide"));
     * */
    exports.focusSlide = function($obj,speed,autoTime){
        var speed=speed || "slow";
        var autoTime=autoTime || 5000;
        var currentindex=0;
        var length=$obj.find(".item").length;
        if(length<2){
            $obj.find(".item").show();
            return;
        }
        //按钮导航
        var $btns=$('<div class="btns"></div>');
        var btnHtml='';
        for(var i=0; i<length; i++){
            btnHtml += '<a href="#">'+(i+1)+'</a>';
        }
        $btns.html(btnHtml);
        $obj.append($btns);
        var $item=$obj.find(".item");
        var $btn=$btns.find("a");
        $item.eq(currentindex).show();
        $btn.eq(currentindex).addClass("on");

        //切换
        var fn = function(index){
            $item.hide();
            $btn.removeClass("on");
            $item.eq(index).stop().fadeIn(speed);
            $btn.eq(index).addClass("on");
        };

        //设置上一个背景（解决切换时有空白出现）
        var setBg = function(index){
            var url=$item.eq(index).find("img").attr("src");
            $obj.find(".ad").css({"background":"url("+url+") no-repeat center 0"});
        };

        /*下一个*/
        var nextFn=function(){
            setBg(currentindex);
            currentindex++;
            if(currentindex==length){
                currentindex=0;
            }
            fn(currentindex);
        };

        //手动点击
        $obj.find(".btns a").each(function(index, element) {
            $(this).on("click",function(){
                currentindex=index;
                fn(index);
            });
        });

        //自动播放
        var timer=setInterval(nextFn, autoTime);
        $obj.on({
            mouseenter:function(){
                clearInterval(timer);
            },
            mouseleave:function(){
                timer=setInterval(nextFn, autoTime);
            }
        });
    };

    /**
     * 简单气泡说明
     * @example
     *      <span data-act="tooltipcol" data-text="test tip">tip</span>
     * */
    exports.tooltips=function(){
        //只一次初始化
        if($("#toolTip").length){
            return;
        }
        var html='<div  class="tool-tip" id="toolTip">' +
                 '<div class="tool-tip-recive">tooltips内容</div>' +
                 '<i class="ar_up"></i><i class="ar_up_in"></i>' +
                 '</div>';

        $("body").append(html);

        var $tooltipcol = $('[data-act="tooltipcol"]');
        var $toolTip = $(".tool-tip");//tip浮层
        var $toolTipRecive = $toolTip.find(".tool-tip-recive");

        $(document).on("mouseenter",'[data-act="tooltipcol"]',function(){
            var $this = $(this);
            var dataText = $this.data("text");
            $toolTipRecive.html(dataText);
            /*
             *当前图标添加hover
             * */
            if($this.hasClass("icon_tip")){
                $this.addClass("icon_tip_hover");
            }
            $tooltipcol["flag"] = $this;

            var $left = $this.offset().left;
            var $top = $this.offset().top;
            var $toolTipW = $toolTip.width()/2;
            //$this.width()/2本身元素宽度的一半
            //-16箭头的总宽度
            $toolTip.css({left:($left-$toolTipW)-16+$this.width()/2,top:$top+$this.height()+8});
            $toolTip.show();
        });
        $(document).on("mouseleave",'[data-act="tooltipcol"],.tool-tip',function(){
            $toolTip.hide();
            var $version_tooltip_css = $(".icon_tip");
            if($version_tooltip_css){
                $version_tooltip_css.removeClass("icon_tip_hover");
            }
        });
        $(document).on("mouseenter",".tool-tip",function(){
            $toolTip.show();
            var $version_tooltip_css = $(".icon_tip");
            if($version_tooltip_css){
                $tooltipcol["flag"].addClass("icon_tip_hover");
            }
        });
    };
    /**
     * 秒钟倒计时
     * @param {$} jqObj 显示秒数容器
     * @param {$} secs 为设定秒数
     * @param {function}  callback 为0秒时回调接入口
     * */
    exports.loadSecond = function(jqObj,secs,callback){
        var i=secs;
        var t= setInterval(function(){
            if(i == 0) {
                clearInterval(t);
                if(typeof(callback) == "function") callback();
            }else{
                jqObj.text('请等待 ' + i + ' s');
            }
            i--;
        },1000);
    };

    /**
     * 上传文件后缀名检测
     * @param {obj} fileObj为file对象
     * @param {string} fileTypes为允许的文件类型，多个用“|”隔开，如"jpg|gif|jpeg|png"
     */
    exports.testFile = function(fileObj,fileTypes){
        var obj = fileObj[0];
        var file = obj.value.match(/[^\/\\]+$/gi)[0];
        var rx=new RegExp("(?:"+fileTypes+")$", "gi");
        if(!rx.test(file)) {
            //清空表单
            if(window.ActiveXObject) {//for IE
                //这个清有问题，干脆不清空了
                //obj.select();
                //document.execCommand('delete');
                //obj.blur();
            } else if(window.opera) {//for opera
                obj.type="text";
                obj.type="file";
            } else obj.value="";//for FF,Chrome,Safari
            layer.alert('<p class="cRed">只允许上传'+fileTypes.replace(/\|/g,"、")+'格式的文件类型</p>',{title:"温馨提示",icon:0});
            return false;
        }
        return true;
    };

    /**
     * 资金输入检查
     * @param {String} id 输入框id
     * */
    exports.checkInputFunds=function(id){
        var $id=$("#"+id);

        $id.keydown(function(e){
            var keyCode = e.keyCode;
            if( (keyCode > 95 && keyCode < 106 )|| keyCode == 110 || //小键盘
                (keyCode > 47 && keyCode < 58) || keyCode == 190 || keyCode == 8){ //键盘
            }else {
                return false;
            }
        }).blur(function(){
            var tPayAmount = this.value;
            var payamount = parseFloat(tPayAmount);
            if (tPayAmount == null || tPayAmount == ''){
                layer.tips("请输入资金!","#"+id);
            }else if (!/^\d+(.\d{1,2})?$/.test(tPayAmount)){
                layer.tips("请输入正确的金额!","#"+id);
                this.value = '';
            }
        });

        if($id.val()==""){
            layer.tips("请输入资金!","#"+id);
            $id.focus();
            return false;
        }else if (!/^\d+(.\d{1,2})?$/.test($id.val())){
            layer.tips("请输入正确的金额!","#"+id);
            $id.val('');
            return false;
        }
        return true;
    };
    /**
     * 资金输入框禁止其他字符输入
     * @param {String} id 输入框id
     * */
    exports.unInputStr=function(id){
        $('#'+id).keydown(function(e){
            var keyCode = e.keyCode;
            if( (keyCode > 95 && keyCode < 106 )|| keyCode == 110 || //小键盘
                (keyCode > 47 && keyCode < 58) || keyCode == 190 || keyCode == 8){ //键盘
            }else {
                return false;
            }
        }).blur(function(){
            var tPayAmount = this.value;
            var payamount = parseFloat(tPayAmount);
            if (tPayAmount == null || tPayAmount == ''){
                layer.tips("请输入资金!","#"+id);
            }else if (!/^\d+(.\d{1,2})?$/.test(tPayAmount)){
                layer.tips("请输入正确的金额!","#"+id);
                this.value = '';
            }
        });
    };
    exports.formatBankNo=function($obj){
        $obj.keydown(function(e){
            var keyCode = e.keyCode;
            if( (keyCode > 95 && keyCode < 106 )|| keyCode == 110 || //小键盘
                (keyCode > 47 && keyCode < 58) || keyCode == 190 || keyCode == 8){ //键盘
                var v=$(this).val();
                v.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
                $(this).val(v);
            }else {
                return false;
            }
        }).blur(function(){
            var id = $(this)[0].id;
            var v = $(this).val();
            v.replace(/\s/g,'');
            if(/^\d+$/.test(v)){
                layer.tips("账号信息只能数字","#"+id);
                return false;
            }
            if(v.length < 10){
                layer.tips("最少输入10位账号信息！","#"+id);
                return false;
            }
            if(v.length > 20){
                layer.tips("最多只能输入20位账号信息！","#"+id);
                return false;
            }
        });
    };

    /**
     * 收益计算器
     * */
    exports.calculator = function(){
        layer.open({
            type: 2,
            title: '收益快捷预算',
            skin: 'yellow-layer-skin',
            content: '/finance/calculate',
            area: ['550px', '600px']
        });
    };

    //头部
    exports.header=function(index){
        var $mainNav=$("#jsMainNav");
        //下拉
        $mainNav.find('[data-rel="carte"]').on({
            "mouseenter":function(){
                $(this).addClass("hover");
            },
            "mouseleave":function(){
                $(this).removeClass("hover");
            }
        });

        //收益快捷预算
        $mainNav.find('[data-act="calculator"]').on("click",function(){
            exports.calculator();
        });

        //当前导航标识
        if(index!=null){
            exports.markCurrentStatus($mainNav,"li a",index,"selected");
            exports.focusSlide($("#focusSlide"));
        }

    };

});