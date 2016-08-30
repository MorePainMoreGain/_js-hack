//继承
/* 一 类式继承 */

//1.1 person 类

function Person(name) {
	this.name = name;
}

Person.prototype.getName = function(){
	return this.name;
}
	//实例化
var reader = new Person("John Smith") ;
reader.getName();

//1.2 创建继承Person的类 author

function Author(name,books) {
	Person.call(this,name); //在本构造函数中，调用超类的构造函数,并将参数name传给它
	//在使用new运算符的时候，系统会为你做一些事。
	//它先创建一个空对象，然后调用构造函数，在此过程中这个空对象处于作用域的最前端。
	this.books =books;
}

Author.prototype = new Person(); 
Author.prototype.constructor = Author; 
Author.prototype.getBooks = function(){
	return this.books;
};

var author  = new Author("Lazy",["boook1"]);
author.getName();
author.getBooks();

//--每个对象都有一个原型对象，但这并不意味着每个对象都有一个prototype属性（实际上只有函数对象才有这个属性）。
//--定义一个构造函数时，其默认的prototype对象是一个Object类型的实例，其constructor属性会被自动设置为该构造函数本身。如果手工将其prototype设置为另一个对象，那么新对象自然不具有原对象的constructor值，所以需要重新设置其constructor属性。

//-- 也就是创建继承三步走：
/*  1:在构造函数中，调用超类的构造函数,
	2:将prototype对象设置为超类的一个实例
	3:重新设置prototype的属性constructor为自身
 */

 
 //1.3 使用extend函数实现继承
 
 function extend(subClass,superClass) {
	 var F = function(){};
	 F.prototype = superClass.prototype;
	 subClass.prototype = new F();//因为prototype对象需要是一个Object类型的实例
	 subClass.prototype.constructor = subClass;
	 
	 subClass.superclass = superClass.prototype;
	 if(superClass.prototype.constructor == Object.prototype.constructor) {
		 superClass.prototype.constructor = superClass;
	 }
 }
//--这是一项改进，它添加了一个空函数F，这么做可以避免创建超类的新实例时可能会进行一些庞大复杂的计算任务。
//--它添加了superclass属性，这个属性可以用来弱化类与超类的耦合。最后三行代码用来确保超类prototype的constructor属性已被正确设置（即使超类就是Object类本身），在用这个新的superclass属性调用超类的构造函数时这个问题很重要：

function Author(name,books) {
	Author.superclass.constructor.call(this,name);
	…………
}
extend(Author,Person);

//-有了superclass属性就可以在既要重定义超类的某个方法而又想访问其在超类中的实现时可以派上用场了（应该很少人会这么用吧！~~！~）；
Author.prototype.getName = function(){
	var name = Author.superclass.getName.call(this);
	return name+', Author of' + this.getBooks().join(",");
}




/* ---二、原型式继承  我表示原型继承果然没有那么好懂咯*/

//Person 原型对象
var Person = {
	name: "default",
	getName: function(){
		return this.name;
	}
};

var reader = clone(Person);
reader.getName();//"default"
reader.name = "djh"
reader.getName();//"djh"

//--clone  函数可以用来创建新的类Person对象。它会创建一个空对象，而该对象的原型对象被设置成Person。
//--这意味着在这个新对象中查找某个方法或属性时，如果找不到，那么查找过程会在其原型对象中继续进行。


//clone 函数的奇妙之处
function clone(object) {
	function F() {};
	F.prototype = object;
	return new F;
}


//--原型式继承直接一个clone就可以了，不过原型对象要使用对象字面量表达式？

// 2.1 掺元类 *通过共享的方式让一些类共享一些函数

//实现可以用来在各类对象中的通用方法的共享才是掺元类如鱼得水的领域。
var Mixin = function() {};
Mixin.prototype = {
	serialize:function() {
		var output = [];
		for(key in this) {
			output.push(key+ ":" + this[key]);
		}
		return output.join(",");
	}
}

augment(Author,Mixin);
var author = new Author("Ross Harmes",["Javascript"]);
var serilizeSring =author.serialize();
function augment(receivingClass,givingClass) {
	if(arguments[2]) {//扩充类的某一个方法
		for(var i=2,len = arguments.length;i<len;i++) {
			receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
		}
	}else {//扩充所有的方法
		for(methodName in givingClass.prototype) {
			if(!receivingClass.prototype[methodName]) {
				receivingClass.prototype[methodName] = givingClass.prototype[methodName];
			}
		}
	}
	  
}








