//分页全选插件
/*
1.0 全选checkbox
2.0 检测checkbox，当页checkbox全部选上之后，总checkbox自动选上，checkbox不满的话，总checkbox自动去掉勾选
3.0 全选checkbox状态跟全选btn状态挂钩
4.0 分页变动，检测改变总checkbox跟全选btn的状态。

*/
!(function($){
	var pluginName = 'checkbox',
		version = '1.0.0';
		
	var defaults = {
		all_check_id: 'checkAll',//allcheckbox id
		checkbox_class: 'input[type=checkbox]',//checkbox class;
	};
	$.fn[pluginName] = function(options){
		var options=$.extend(defaults,options);
	}
		
})(jQuery);