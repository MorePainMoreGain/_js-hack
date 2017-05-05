/*carousel js*/
/**
*js 插件开发也即是面向对象编程
*插件即是一个对象
*
**/
;(function(){
	//自执行函数，立即执行函数
	function carousel(options){
		
		//初始化函数
		this.defaults = {
			
		};
		console.log("hihihi");
		var option = $.extend({},defaults,options);//合并参数
		carousel.prototype = {
			//扩展原型链函数，做不同的操作
			
		}
		
		
	}
	$.fn.carousel =carousel();//对外暴露接口；
	
})();