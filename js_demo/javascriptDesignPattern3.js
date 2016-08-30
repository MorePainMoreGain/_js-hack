//设计模式

//学而不思则罔，思而不学则殆。当不懂的时候，就要去琢磨琢磨，实践实践，因为看过，并不代表你懂。

/* 一、 工厂模式 */
//在JS中创建对象会习惯的使用 new 关键字和类构造函数（当然主要还是对象字面量），问题在于这样会导致两个类之间产生依赖性。工厂模式就是一种有助于消除两个类依赖性的模式。

//--实际是定义一个创建对象的接口，但是让实现这个接口的类来决定实例化哪个类。
//--工厂方法可以用来创建封装了许多较小对象的对象。

var BicycleShop = function() {};
BicycleShop.prototype = {
	sellBicycle: function(model) {
		var bicycle;
		switch(model) {
			case "The Speedster" :
				bicycle = new Speedster();
				break;
			case "The Lowrider":
				bicycle = new Lowrider();
				break;
			default:
				bicycle = new　comfortCruiser();
		}
		
		Interface.ensureImplements(bicycle,Bicycle);
		bicycle.assemble();
		bicycle.wash();
		
		return bicycle;
	}
}

//sellBicycle 方法根据所提供的自行车型号来进行自行车的实例创建。那么对于一家ABC店铺，需要Speedster车型我只需要
    var ABC = new BicycleShop();
    var myBike = ABC.sellBicycle("The Speedster");


//以上方式很管用，但是一旦说我需要添加一些自行车款式的时候我就必须修改 BicycleShop 的 switch 部分，那么只要是修改就有可能带来BUG。所以，将这部分生成实例的代码单独的提出来分工交给一个简单的工厂对象是一个很不错的方法。


var BicycleFactory = {
	createBicycle : function( model ){
		var bicycle;
		switch( model ){
			case "The Speedster":
				bicycle = new Speedster();
				break;
			case "The Lowrider":
				bicycle = new Lowrider();
				break;
			case "The Cruiser":
			default:
				bicycle = new Cruiser();
				break;
		}
		return bycicle;
	}
}

var BicycleShop = function(){};

BicycleShop.prototype = {
	sellBicycle : function( model ){
		var bicycle = BicycleFactory.createBicycle(model);     
		return bicycle;
	}
}
//  以上就是一个很好的 简单工厂模式 的实例。该模式将成员对象的创建工作交给一个外部对象实现，该外部对象可以是一个简单的命名空间，也可以是一个类的实例。


// 简单工厂模式：使用一个类（通常为单体）来生成实例。
// 复杂工厂模式：使用子类来决定一个成员变量应该是哪个具体的类的实例。



var AcmeBicycleShop = function(){};

extend( AcmeBicycleShop , BicycleShop );
AcmeBicycleShop.prototype.createBicycle = function( model ){
	var bicycle;
	switch( model ){
		case "The Speedster":
			bicycle = new AcmeSpeedster();
			break;
		case "The Lowrider":
			bicycle = new AcmeLowrider();
			break;
		case "The Cruiser":
		default:
			bicycle = new AcmeCruiser();
			break;
	}
	return bicycle;
}

var GeneralBicycleShop = function(){};

extend( GeneralBicycleShop , BicycleShop );
GeneralBicycleShop.prototype.createBicycle = function( model ){
   ...
}


/* ---------------------------------二 、桥接模式---------------------------------------- */

//对于一个api开发来说，最好从一个优良的api开始，不要把它与任何特定的实现混在一起；
//桥接模式的优点是找出那些存在强耦合的抽象部分，然后用桥接模式把抽象与实现分开。
addEvent(element,"click",getBeerById);
function getBeerById(e) {
	var id = this.id;
	asyncRequest("GET","beer.uri?id="+id,function(res) {
		//callback;
	});
}

addEvent(element,"click",getBeerByIdBridge);
function getBeerByIdBridge (e) {
	getBeerById(this.id,function(beer){
		//callback;
	});
}

var class1  = function(a,b,c) {
	this.a = a;
	this.b = b;
	this.c = c;
}

var class2  = function(d) {
	this.d = d;
}

var BridgeClass = function(a,b,c,d) {
	this.one = new class1(a,b,c);
	this.two = new class2(d);
}

//每使用一个桥接元素都要增加一次函数调用，这对应用程序的性能会有一些负面影响，而且也调高了系统的复杂度。


/* ---------------------------------二 、组合模式---------------------------------------- */
//组合对象可以用来把一批子对象阻止成树形结构，并且使整棵树都可被遍历。
//使用这种模式，可以用一条命令在多个对象上激发复杂的或递归的行为。
//组合模式擅长对大批对象或其中一部分对象实施一个操作。

//--示例： 表单验证
//表单中实际拥有的域会因用户而异，我们希望设计一个模块化的表单，以便将来任何时候都能为其添加各种元素，而不用修改save和validate函数。

//组合对象类
var composite = new Interface("composite",["add","remove","getChild"]);
var FormItem = new Interface("formItem",["save"]);

var compositeForm = function(id,method,action) {
	this.formComponents = [];
	
	this.element = document.createElement("form");
	this.element.id = id;
	this.element.method = method || "POST";
	this.element.action = action || "#";
};

composite.prototype = {
	add: function(child) {
		Interface.ensureImplements(child,composite,formItem);
		this.formComponents.push(child);
		this.element.appendChild(child.getElement());
	},
	remove: function(child) {
		for(var i = 0,len = this.formComponents.length; i< len;i++) {
			if(this.formComponents[i]==child) {
				this.formComponents.splice(i,1);
				break;
			}
		}
	},
	getChild: function(i) {
		return this.formComponents[i];
	},
	save: function() {
		for(var i = 0,len = this.formComponents.lenght;i<len;i++) {
			this.formComents[i].save();
		}
	},
	getElement: function() {
		return this.element;
	}
}

//叶对象类
var field = function(id) {
	this.id = id;
	this.element;
}

field.prototype = {
	add: function() {},
	remove: function() {},
	getChild: function() {},
	save: function() {
		setCookie(this.id,this.getValue());
	},
	getElement = function() {
		return this.element;
	},getValue = function() {
		throw new Error("不支持这种方法");              
	}
}

var inputField = function(id,label) {
	field.call(this,id);
	
	this.input  = document.createElement("input");
	this.input.id = id;
	
	this.label = document.createElement("label");
	var labelTextNode = document.createTextNode(label);
	this.label.appendChild(labelTextNode);
	
	this.element =document.createElement("div");
	this.element.className = "input_field";
	this.element.appendChild(this.label);
	this.element.appendChild(this.input);
};
extend(inputField,field);
InputField.prototype.getValue = function() {
	return this.input.value;
}

var textareaField = function(id,label) {
	field.call(this,id);
	
	this.textarea  = document.createElement("textarea");
	this.textarea.id = id;
	
	this.label = document.createElement("label");
	var labelTextNode = document.createTextNode(label);
	this.label.appendChild(labelTextNode);
	
	this.element =document.createElement("div");
	this.element.className = "input_field";
	this.element.appendChild(this.label);
	this.element.appendChild(this.textarea);
};
extend(textareaField,field);
InputField.prototype.getValue = function() {
	return this.textarea.value;
}

var selectField = function(id,label) {
	field.call(this,id);
	
	this.select  = document.createElement("select");
	this.select.id = id;
	
	this.label = document.createElement("label");
	var labelTextNode = document.createTextNode(label);
	this.label.appendChild(labelTextNode);
	
	this.element =document.createElement("div");
	this.element.className = "input_field";
	this.element.appendChild(this.label);
	this.element.appendChild(this.select);
};
extend(textareaField,field);
InputField.prototype.getValue = function() {
	return this.select.option[this.select.selectedIndex].value;
}


//汇合起来

var contactForm = new compositeForm("contact-form","POST","contact.php");

contactForm.add(new inputField("firstName","First Name"));
contactForm.add(new inputField("LastName","Last Name"));
contactForm.add(new selectField("state","State"));
contactForm.add(new textareaField("comment","Comments"));

addEvent(window,"unload",contactForm.save);



