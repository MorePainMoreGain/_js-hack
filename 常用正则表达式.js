/*常用正则表达*/

 //添加手机验证规则
    $.validator.addMethod("isMobile", function(value, element) {
        var tel = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])\d{8}$/;
        return this.optional(element) || (tel.test(value));
    }, "请输入正确的手机号码!");
    //号码，固话与手机都可以
    jQuery.validator.addMethod("allPhone", function(v, e) {
            return this.optional(e) || /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(v)||/^(1(([35][0-9])|(47)|[8][0126789]))\d{8}$/.test(v);},
        "请输入电话号码/区号-电话号码/手机号");

    //固话、传真,传真格式与固话是一样的
    jQuery.validator.addMethod("isTel", function(v, e) {
            return this.optional(e) || /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(v);},
        "请输入正确的电话号码");
		
 // 判断是否包含中英文特殊字符，除英文"-_"字符外
	jQuery.validator.addMethod("isContainsSpecialChar", function(value, element) {
		var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
		return this.optional(element) || !reg.test(value);
	}, "不能包含特殊字符");