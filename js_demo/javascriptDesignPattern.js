//javascript 设计模式
/* 一、封装  */
//1.1 门户大开型对象

var Book = function(isbn,title,author) {
	if(isbn == undefined) throw new Error("Book constructor requires an isbn.");
	this.isbn = isbn;
	this.title = title || "No title specified";
	this.author = author || "No author specified";
}

Book.prototype = function(){
	//检查isbn，因为display（）会用到isbn，如果isbn的参数有问题，那么display（）可能会失效
	checkIsbn: function(isbn){
		if(isbn == undefined || typeof(isbn)!="string"){
			return false;
		}
		isbn = isbn.replace(/-/g,"");//去掉杠杠
		if(isbn.length != 10 && isbn.length != 13) return false;
	},//因为一本书可能有多个版本，每个版本都有自己的isbn，所以要用get（），set（）直接修改其属性
	getIsbn: function(){
		return this.isbn;
	},
	setIsbn: function(){
		if(!this.checkIsbn(isbn)) throw new Error("Book constructor requires an isbn.");
		this.isbn =isbn;
	},
	display: function(){
		
	}
	//也是由于这个方法引用了get，set方法所以出现了多余的代码。
	
	
}

//1.2 用命名规范区别私用成员
var Book = function(isbn,title,author) {
	if(isbn == undefined) throw new Error("Book constructor requires an isbn.");
	this.setIsbn(isbn);
	this.setTitle(title);
	this.setAuthor(author);
}

Book.prototype = function(){
	//检查isbn，因为display（）会用到isbn，如果isbn的参数有问题，那么display（）可能会失效
	checkIsbn: function(isbn){
		if(isbn == undefined || typeof(isbn)!="string"){
			return false;
		}
		isbn = isbn.replace(/-/g,"");//去掉杠杠
		if(isbn.length != 10 && isbn.length != 13) return false;
	},//因为一本书可能有多个版本，每个版本都有自己的isbn，所以要用get（），set（）直接修改其属性
	getIsbn: function(){
		return this._isbn;
	},
	setIsbn: function(){
		if(!this.checkIsbn(isbn)) throw new Error("Book constructor requires an isbn.");
		this._isbn =isbn;
	},
	display: function(){
		
	}
	//下划线这种用法是一个总所周知的命名规范，它表明一个属性（或方法）仅供对象内部使用
	//但这种方法只能防止别的程序员对它的无意使用，却不能防止它的有意使用。
}

//1.3 用闭包实现私有成员
	//所谓的closure, 内部函数可以访问外部函数的变量
var Book = function(newIsbn,newTitle,newAuthor){
	//私有变量
	var isbn,title,author;
	function chekIsbn(isbn){
		
	}
	
	//特权方法
	this.getIsbn = function(){
		return isbn;
	};
	this.setIsbn = function(){
		if(!chekIsbn(newIsbn)) throw new Error("Book constructor requires an isbn.");
		isbn =newIsbn;
	}
	
	this.setIsbn(newIsbn);
	this.setTitle(newTitle);
	this.setAuthor(newAuthor);
}

	//公共，非特权方法
Book.prototype = {
	display: function(){
		
	}
}

//特权方法和非特权方法都是通过Object.method()访问，但是特权方法能访问对象的私有变量，非特权方法则不能，这是根本的区别。

//特权方法太多又会占用过多内存，因为每个对象实例都包含了所有特权方法的新副本。

/*  二、 更高级的对象创建模式 */
//2.1 静态属性和方法 ，静态成员是在类的层次上操作的，而不是在实例的层次上操作的

//立即执行这种方法使得Book只是一个用于存放静态私有变量的构造函数，实例化的实际是下面这个函数


var Book =(function(){
	//私有静态属性
	var numOfBooks = 0;
	
	//私有静态方法
	function checkIsbn(isbn){
		
	}//--checkIsbn被设计为静态方法，因为Book的每个实例都生成这个方法的新副本毫无道理。
	
	//返回函数 ;因为返回的是一个函数，函数又能引用这个类的私有变量，称之为闭包
	 
	return function(newIsbn,newTitle,newAuthor){
		//私有属性
		var isbn,title,author;
		//特权方法
		this.getIsbn = function(){
			return isbn;
		};
		this.setIsbn = function(newIsbn){
			return isbn =newIsbn;
		}
		//实例代码
		numOfBooks++; //通过私有静态属性，追踪实例化了多少本书
		if(numOfBooks > 50) throw new Error("最多只能实例化50本书");
		
		this.setIsbn(newIsbn);
		this.setTitle(newTitle);
		this.setAuthor(newAuthor);
		
	}
})();

//公共静态方法
Book.convertToTitleCase = function(inputString){
	
};

//公共非特权方法
Book.prototype = {
	display: function(){
		
	}
}

//--公共的静态方法和非特权方法有什么区别呢？

//2.2 常量 常量只不过是一些不能被修改的变量

var Class = (function(){
	//私有静态属性
	var constants = {
		upper: 100,
		lower: -100
	};
	
	//构造函数
	var ctor = function() {
		
	};
	
	//特权静态方法
	ctor.getConstant = function(name) {
		return constants[name];
	}
	
	return ctor;
});





