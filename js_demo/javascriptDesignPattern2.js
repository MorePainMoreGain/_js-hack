//单体模式

//1. 最简单的单体实际上就是一个对象字面量,可以用它来阻止一批相关方法和属性。
//单体是一个对象字面量，貌似是不可以传参数的哟。

var single = {
	attr1: true,
	method1:function(){
		
	}
}

//1.1 使单体拥有私有成员 
// 一是使用前面封装时用到的那种_name的方法来约定
//二是使用闭包

var single = {
	_attr:false,
	method:function(){
		
	}
}

var singleClosesure = (function(){
	var name = "djh";
	var name2 = "hehe";
	
	var method = function(){
		
	}
	return {
		publicAttr1:  true,
		publicMethod: function(args) {
			
		}
	};
	
})();

//--1.2 惰性加载单体

var singleLazy = (function(){
	var uniqueInstance;
	function constructor() {//用来放置原本一般的单体代码。
		var name = "djh";
		var name2 = "hehe";
		
		var method = function(){
			
		}
		return {
			publicAttr1:  true,
			publicMethod: function(args) {
				
			}
		};
	};
	return {
		getInstance: function(){
			if(!uniqueInstance) {
				uniqueInstance = constructor();
			}
			return uniqueInstance;
		}
	}
})();

singleLazy.getInstance().publicMethod();

//这种惰性加载比较复杂，而且不好理解。
//它其实就是绕了个圈，再实例化constructor，除非constructor里面代码量很庞大，否则，没必要。


//--1.3 分支
//分支是一种把浏览器间的差异封装在运行期间进行设置的动态方法技术。

var singleTon = (function(){
	var abjectA = {
		method1: function(){
			
		}
	};
	var abjectB = {
		method1: function(){
			
		}
	}
	return (wantA) ? objectA : objectB;
})();


//--单体模式很像seajs里面的exports的思想，既可以提供命名空间又可以增强模块性。
//--但是单体模式有可能会导致类间的强耦合，所以它也不利于单元测试。



/* 二、链式调用 */
//非链式调用的例子
addEvent($("example"),"click",function(){
	setStyle(this,"color","green");
	show(this);
});
//链式调用的例子
$("example").addEvent("click",function(){
	$(this).setStyle("color","green").show();
});

//返回一个html元素或一个html元素的集合的$函数
function $() {
	var elements =[];
	for(i = 0,len = arguments.length; i< len; ++i) {
		var element = arguments[i];
		if(typeof element === "string") {
			element = document.getElementById(element);
		}
		if(argument.lenght===1) {
			return element;
		}
		elements.push(element);
	}
	return elements;
}

// 把上例函数改造为构造器
// 把元素作为数组保存在一个实例属性中
// 让构造器中所有prototype属性中的方法都返回这个实例的引用

(function(){
	
	function _$() {
		this.elements = [];
		for(i = 0,len = arguments.length;i<len;i++) {
			var element = arguments[i];
			if(typeof element=="string") {
				element = document.getElementById(element);
			}
			this.elements.push(element);
		}
	}
	_$.prototype = {
		setStyle:function(prop,val) {
			this.each(function(el){
				el.style[pro] = val;
			});
			return this;
		},
		show: function() {
			this.each(function(el){
				el.setStyle("display","block");
			});
			return this;
		}
	}
	
	window.$ = function() {
		return new _$(arguments);
	};
})();


//--2.1 包含最常用特性的javascript库
/* 
	事件--添加和删除事件监听器；对事件对象进行规范化处理
	DOM --类名管理：样式管理
	Ajax--对XMLHttpRequest进行规范化处理
 */

Function.prototype.method = function(name,fn) {
	this.prototye[name] = fn;
	return this;
}

(function(){
	
	function _$() {
		this.elements = [];
		for(i = 0,len = arguments.length;i<len;i++) {
			var element = arguments[i];
			if(typeof element=="string") {
				element = document.getElementById(element);
			}
			this.elements.push(element);
		}
	}
	_$.method(setStyle,function(){
		
	});
	
	//这个安装器十分有用，可以将封装的javascript库添加到不同的命名空间对象中
	window.installHelper = function(scope,interface) {
		scope[interface] = function() {
			return new _$(arguments);
		}
	}
	
})();

//如果有这个命名空间则追加，不会覆盖
	window.com = window.com || {};
	com.example = com.example || {};
	com.example.util = com.example.util || {};
	
	installHelper(com.example.util,"get");
	
(function(){
	var get = com.example.util.get;
	get("example").addEvent("click",function(e){
		get(this).addClass("hell0");
	})
})();

//但要顾及取值器之类的方法，是要返回特定的数据，不能再继续链式调用
(function(){
	
	function _$() {
		……
	}
	_$.getName = function() {
		…………
		return name;
	}
	
	//这个安装器十分有用，可以将封装的javascript库添加到不同的命名空间对象中
	window.installHelper = function(scope,interface) {
		scope[interface] = function() {
			return new _$(arguments);
		}
	}
	
})();

//javascript 中对象是作为引用被传递的。如果让每个方法都传回对象的引用，那么这个类就支持链式调用了







