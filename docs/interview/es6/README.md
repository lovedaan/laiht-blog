# ES6

es6也叫es2015，也就是说距发布到现在已经有5年了，因为提出了很多新特性，浏览器无法完全兼容，也叫下一代的js，es6解决了es5及js设计之初的一些缺陷，时至今日，浏览器的兼容性越来越好，以及node环境的大量支持，很好的提高我们开发效率，所以我们必须要很深入的去学习es6，

## 一、变量和常量

### 1.es5的声明变量的方式

>  es5声明变量的方式有：var和function.

我们先来看看用var声明变量会有什么问题：

- 变量提升，在声明变量所在作用域的最前面打印这个变量是undefined，并没有报错，其实这是不合理的，应该遵循先声明后使用这个原则
- 全局作用域下用var声明的变量会自动绑定到window上，在其他地方可能会被无意修改，污染全局变量
- 可以重复声明，容易覆盖

```javascript
// ①
console.log(a); // undefined
var a = 10;

// ②
var n = 10;
console.log(window.n); // 10

// ③
var c = 20;
var c = 'hello';
console.log(c); // hello
```

### 2. let和const

es6新增的变量声明方式有：left、const、import、class等，import和class会在下面的部分着重介绍

> let是声明变量，可以用来代替var

let相比var有哪些特点：

- 没有变量提升，必须先声明后使用
- 全局作用域下声明也不会挂载在window上
- 不能重复声明
- 有块级作用域，块级指的是双大括号包裹的区域`，if for 函数 {} `都能块级作用域，暂时性死区，es5只有全局作用域和函数作用域

```javascript
// ①
console.log(a); // ReferenceError: a is not defined
let a = 10;

// ②
let n= 10;
console.log(window.n); // undefined

// ③
let c = 20;
let c = 'hello'; 
console.log(c); // SyntaxError: Identifier 'c' has already been declared

// ④
let d = 10;
{
    let d = 20;
    console.log(d); // 20
}

// 暂时性死区
let e = 10;
{
    // 在当前块级作用域下，有声明未使用的变量，在之前使用，会有遮蔽效应，作用域链不会往外查找
    console.log(e); // ReferenceError: e is not defined
    let e = 20;
}

// 经典的面试题
for(var i = 0; i < 10; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
// 我们知道打印的是10个10，那如果需要打印序号呢？就可以使用let来声明
// 每一次循环都会生成单独的块级作用域，所以每个i都是不一样的
for(let i = 0; i < 10; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
```

> const表示常量，如果声明的是普通数据类型，这个`值`不可改变，如果是引用类型，则`引用空间地址`不可变，其他特性和let基本一致

```javascript
const PI = 3.14159;
PI = 4;
console.log(PI); // TypeError: Assignment to constant variable.

// ==============
const obj = {
    name: 'lisi'
};
obj.age = 20;
console.log(obj); // {name: "lisi", age: 20}

obj = {n: 20};
console.log(obj); // TypeError: Assignment to constant variable.
```

### 3. 总结

在我们的日常开发中，应该尽量用let和const来替换var，那什么时候用let，什么时候用const？

> 我觉得我们应该遵循优先使用const来声明常量或变量，当我们发现声明的变量需要在某些时候改变的时候，才使用let

## 二、Symbol

> Symbol：是es6新增的一种简单数据类型，表示独一无二，是一个内置函数，接收一个参数作为symbol的描述

js的数据类型：number、string、boolean、null、undefined、symbol、object

symbol的特点：

- 独一无二
- 作为对象的key值时，这个属性是不可以枚举的，就是使用for in遍历不出来的，如需取出这个key，可以使用es6新增的，Object.getOwnPropertySymbols(obj)
- 作为语言原编程的功能，可以改变系统级别的默认方法，有11种，[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Meta_programming)

```javascript
// 声明一个symbol，可以接收一个参数，作为这个symbol的描述
{
    let a = Symbol('name');
	console.log(typeof a); // 'symbol'
	console.log(a); // Symbol(name)
	
	let b = Symbol('name');
	console.log(a === b); // false
}

// 可以作为对象的key值
{
    let a = Symbol('name');
    let obj = {};
    obj[a] = '李四';
    console.log(obj) // {Symbol(name): "李四"}
    console.log(obj[a]); // 李四
    
    for(let key in obj) {
        console.log(obj[key]); // 使用symbol作为key值是不可以枚举的，Object.keys(obj)也拿不到
    }
    // 这个方法是可以拿到
    console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(name)]
}

//  Symbol.for()使用给定的key搜索现有的symbol，如果找到则返回该symbol。否则将使用给定的key在全局symbol注册表中创建一个新的symbol。
// Symbol.keyFor()会从全局symbol注册表中，为给定的symbol检索一个共享的?symbol key。
{
    let a1 = Symbol.for('xxx');
    let a2 = Symbol.for('xxx');
    
    console.log(a1 === a2) // true
    console.log(Symbol.keyFor(a1)); // 'xxxx'
}

```

JavaScript内建了一些在ECMAScript 5 之前没有暴露给开发者的symbol，它们代表了内部语言行为。它们可以使用以下属性访问，总共有11个：

迭代 symbols

- [`Symbol.iterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)：一个返回一个对象默认迭代器的方法。被 `for...of` 使用。
- [`Symbol.asyncIterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) ：一个返回对象默认的异步迭代器的方法。被 `for await of` 使用。

正则表达式 symbols

- [`Symbol.match`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match)：一个用于对字符串进行匹配的方法，也用于确定一个对象是否可以作为正则表达式使用。被 [`String.prototype.match()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match) 使用。
- [`Symbol.replace`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/replace)：一个替换匹配字符串的子串的方法. 被 [`String.prototype.replace()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 使用。

```javascript
// 可迭代对象必须包含Symbol.iterator,它的值是一个生成器函数（generator）
// Array.from() 和 [...args] 这两个都可以把一个类数组转成数组，
// 展开运算符只能用于有下标，有length，可迭代（Symbol.iterator）

function show() {
	let args1 = Array.from(arguments);
	let args2 = [...arguments];
	console.log(args1, args2)
}
show(1, 2)

{
    let obj = {
        0: 1,
        1: 2,
        length: 2
    };
    // 只要对象有下标和length就可以转成数组
    let arr1 = Array.from(obj);
    console.log(arr1)
	let arr2 = [...obj];
    console.log(arr2) // object is not iterable (cannot read property Symbol(Symbol.iterator))
}

// 实现一下Symbol.iterator
{
    let obj = {
        0: 1,
        1: 2,
        length: 2,
        [Symbol.iterator]: function*() {
            // console.log(this)// this指的是当前这个对象
            let i = 0;
            // 循环this.length次
            while(this.length !== i) {
                yield this[i++]
            }
        }
    };
    let arr1 = Array.from(obj);
    console.log(arr1)
	let arr2 = [...obj];
    console.log(arr2) 
}
```

