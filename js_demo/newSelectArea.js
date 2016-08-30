/* 
seleAreaMobile new 插件
设计得不够好，强耦合
 */
 
 ;(function(){
	 var selectArea = function(options) {
		 var defaults = {
			wrapper:"areaWrapper",//容器
			selected: "selected",//已经选择好的
			forselect: "forselect",//用于选择的
			fv:"id",
			hasSuffix:true,
			callback:function(){}
		 }
	 }
	 var settings = $.extend({},defaults,options);
	 var _that = $(this);
	 var wapper,selected,forselect;
	 
	 selectArea.prototype ={
		 init: function(){
			document.head.appendChild(function(){
			var link = document.createElement('link');
			link.href = '/static/ruyi_h5/js/areaSelect/mobile.css';
			link.rel = 'styleSheet';
			link.id = 'mobilecss';
			return link;
			});
			this.initDom();
			this.provInt();
		 },
		 initDom:function(){
			if($("#"+settings.wrapper.length<1)) {
				var ul = '<div id="'+settings.areaWrapper'">' +
				'<div class="head"><a class="arrow_left"></a><span>请选择地址</span></div>' +
				'<ul id="'+settings.selected+'" class="layout"></ul>'+
				'<ul id="'+settings.forselect+'" class="layout"></ul>'+
				'<div class="foot"></div>' +
				'</div>';
				$("body").append(ul);
			} 
			wrapper =   $("#"+settings.wrapper);
			selected =  $("#"+settings.selected);
			forselect = $("#"+settings.forselect);
			
			
			//一般事件
			_that.on("tap",function(){
				$("#pgLayout").addClass("hide");
				wrapper.addClass("on");
			});
			wrapper.on("tap",".arrow_left",function(){
				$("#pgLayout").removeClass("hide");
				$("body,html").animate({scrollTop:0},500);
				wrapper.removeClass("on");
			});
			wrapper.on("tap",".no",function(){
				$("#pgLayout").removeClass("hide");
				$("body,html").animate({scrollTop:0},500);
				wrapper.removeClass("on");
			});
			
			forselect.on("tap","li",function(){

				if(forselect.attr("data-act")=="pro"){
					selected.append($(this).addClass("pro").clone());
					//点击省份
					var prov_id=$(this).data("id").toString() || 0;
					this.cityInt(prov_id);
				}else if(forselect.attr("data-act")=="city") {
					selected.append($(this).addClass("city").clone());
					//点击市
					var city_id =$(this).data("id").toString() || 0;
					this.distInt(city_id);
				}else {
					selected.find(".dist").remove();
					selected.append($(this).addClass("dist").clone());
					this.setVal();
				}
			});

			selected.on("tap","li",function(){
				var _this =$(this);
				if(_this.hasClass("pro")){
					//点击省份
					selected.empty();
					this.provInt();

				}else if(_this.hasClass("city")) {
					//点击市
					var prov_id=_this.siblings(".pro").data("id").toString() || 0;
					selected.find(".city").remove(".city");
					selected.find(".dist").remove(".dist");
					this.cityInt(prov_id);
				}else {
					selected.find(".dist").remove(".dist");
					var city_id =_this.siblings(".city").data("id").toString() || 0;
					this.distInt(city_id);
				}
			});
		 },
		 provInt: function(){
			//获取省份
			for(k=0; k<dataCity.length; k++){
				if(dataCity[k].id.toString().substr(2,2) == "00" && dataCity[k].s!=""){
					var content ='<li data-value="'+dataCity[k][settings.fv]+'" data-id="'+dataCity[k].id+'">'+dataCity[k][title]+'</li>';
					$(content).appendTo($(fragment));
				}
			}
			forselect.empty().append(fragment);
			forselect.attr("data-act","pro");
		 },
		 cityInt: function(prov_id){
			var pro_html="";
			if( parseInt(prov_id.substr(0,4),10) >=4100 || parseInt(prov_id.substr(0,4),10) <=1300){
				for(var key in dataCity){
					if(dataCity[key].id ==prov_id && dataCity[key].s!=""){
						pro_html+='<li value="'+dataCity[key][settings.fv]+getSuffix(dataCity[key].s)+'" data-id="'+dataCity[key].id+'">'+dataCity[key][title]+getSuffix(dataCity[key].s)+'</li>';
					}
				}
			}else{
				//for(var key in dataCity){
				for(k=0; k<dataCity.length; k++) {
					if(dataCity[k].id.toString().substr(0,2) == prov_id.toString().substr(0,2) && dataCity[k].id !=prov_id && dataCity[k].s!=""){
						pro_html+='<li value="'+dataCity[k][settings.fv]+getSuffix(dataCity[k].s)+'" data-id="'+dataCity[k].id+'">'+dataCity[k][title]+getSuffix(dataCity[k].s)+'</li>';
					}
				}
			}
			forselect.empty().append(pro_html);
			forselect.attr("data-act","city");
		},
		distInt:function(city_id){
			var city_html="";
			//for(var key in dist){
			for(k=0; k<dist.length; k++) {
				if(dist[k].id.toString().substr(0,4) == city_id.toString().substr(0,4)){
					city_html+='<li value="'+dist[k][settings.fv]+'" data-id="'+dist[k].id+'">'+dist[k][title]+'</li>';
				}
			}
			if(city_html==""){
				forselect.empty();
				this.setVal();
			}else {
				forselect.empty().append(city_html);
				forselect.attr("data-act","dist");
			}
		},
		setVal: function() {
			var text="";
			selected.find("li").each(function(i,dom){
				text+=$(dom).text()+" ";
			});
			_that.val(text);
			$("#pgLayout").removeClass("hide");
			wrapper.removeClass("on");
			$("body,html").animate({scrollTop:0},500);
		}
	 }
	 
	 $.fn.selectAreaMobile = function(){
		 return selectArea();
	 }
 })();