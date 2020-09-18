# 手写call和apply和bind

这三个方法都是Function.prototype上的方法，所有函数都能调用，他们的作用都是用来改变函数的上下文this

## 一、call

### 1. call的用法

首先我们先来看一下关于this指向问题，这里只是简单介绍两种常见的判断方法，关于this指向后续会详细的单独讲解

```javascript
// 判断this指向的第一种方法
function foo() {
    // 在非严格模式下直接调用函数，那么函数内部的this就指向全局（window或者global），严格模式下就是undefined
    console.log(this)
}
// 直接调用
foo()

// 判断this指向的第二种方法
var obj = {
    name: 'lisi',
    fn: function() {
        console.log(this.name)
    }
}
// 把函数当做对象的方法来调用，那函数内部的this就指向当前这个对象
obj.fn();
```

再看一下eval的用法：传递一个字符串，然后执行

```javascript
var str = 'console.log(1)'
eval(str); // 打印 1
// 可以看出eval可以用来执行一个字符串语句

var arr = [1, 2, 3];
eval('console.log('+arr+')'); // 当把数组动态绑定的时候，实现上先调用数组的toString方法，然后会把数组展开1 2 3
```

现在我们想让函数内部的this指向一个对象obj，可以调用call方法

```javascript
var obj = {
    name: 'lisi'
};
function foo(a, b) {
    console.log(this, a, b)
    return this.name;
}
var name = foo.call(obj, 1, 2);
console.log(name);
```

从上面的事例我们可以总结出call的用法：

- call方法接收的第一个参数将作为函数上下文this的指向，其余参数散列传递作为函数的实参
- 调用当前函数
- 把当前函数的执行结果返回

### 2. call的实现

我们根据上述例子已经了解了call的用法，那么我们就来动手实现一下我们自己的call方法

1. 函数里面的arguments是函数的实参列表，是一个类数组
  2. arguments[0]就作为当前函数的上下文this指向
  3. 利用this指向规则：把函数当做对象的方法来调用，那函数内部的this就指向当前这个对象,在这个对象上构建一个方法，指向当前的函数
  4. call方法内部的this就指向当前函数
  5. 借助eval函数可以执行字符串

使用es5来实现call方法：

```javascript
var obj = {
    name: 'lisi'
};
function foo(a, b) {
    console.log(this, a, b)
    return this.name;
}

// 这是我们自己的call方法
Function.prototype.myCall = function() {
    if(typeof this !== 'function') {
        throw new Error('call方法只能被函数调用')
    }
    var context = arguments[0]
    if(arguments[0] == null) {
        context = window
    }
    // context就是一个对象，我们在它上面构建一个方法，指向当前的调用函数,而这个this就指向当前的调用函数
    context.fn = this;
    // 将call方法的除了第一个参数外的其他参数依次传递给当前这个调用函数
    // 我们用for循环遍历后依次把值存进一个数组中，这算是最简单的把类数组转成数组的方法
    var args = [];
    for(var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    // 利用eval函数调用当前方法，并把参数散列传递
    var res = eval('context.fn('+args+')');
    // 回收删除context上面的fn属性
    delete context.fn;
    // 返回函数的执行结果
    return res;
}

// 调用我们自己的call方法
var name = foo.myCall(obj, 1, 2);
console.log(name);
```

使用es6来实现call方法：

```javascript
const obj = {
    name: 'lisi'
};
function foo(a, b) {
    console.log(this, a, b)
    return this.name;
}
Function.prototype.myCall = function(target, ...args) { // 利用es6 函数的剩余参数，args就是一个数组
    if(typeof this !== 'function') {
        throw new Error('call方法只能被函数调用')
    }
    if(target == null) {
        target = window
    }
    // context就是一个对象，我们在它上面构建一个方法，指向当前的调用函数,而这个this就指向当前的调用函数
    target.fn = this;
    // es6的展开运算符，把数组每一项都展开,通过babel编译之后，其实是使用apply来调用的
    const res = target.fn(...args);
    delete target.fn;
    return res;
}
const name = foo.myCall(obj, 1, 2);
console.log(name);
```

## 二、apply

apply的用法和call很基本相同，唯一的区别就是参数的传递上，apply的第二个参数是一个数组，call方法的参数传递是一个一个的传。

### 1. apply的用法

了解了call方法的使用，再来用apply就容易多了

```javascript
var obj = {   
    name: 'lisi'
};
function foo(a, b) {   
    console.log(this, a, b)    
    return this.name;
}
// 第二个参数是一个数组
var name = foo.apply(obj, [1, 2]);
console.log(name);
```

### 2. apply的实现

apply的实现和call方法的实现也很类似

使用es5来实现apply方法：

```javascript
var obj = {
    name: 'lisi'
};
function foo(a, b) {
    console.log(this, a, b)
    return this.name;
}

// 这是我们自己的apply方法
Function.prototype.myApply = function(target, args) {
    if(typeof this !== 'function') {
        throw new Error('apply方法只能被函数调用')
    }
    var isArray = Array.isArray(args);
    var isType = typeof args;
    // 第二个参数不能是number，boolean，string这几个类型
    if(args && ['number', 'boolean', 'string'].indexOf(isType) > -1) {
        throw new Error('apply方法的第二个参数不能是简单值类型')
    }
    if(target == null) {
        target = window
    }
    // context就是一个对象，我们在它上面构建一个方法，指向当前的调用函数,而这个this就指向当前的调用函数
    target.fn = this;
    // 判断参数是数组的时候，再利用eval函数调用当前方法，并把参数散列传递，如果不是数组就不用传
    var res = isArray ? eval('target.fn('+args+')') : target.fn();
    // 回收删除context上面的fn属性
    delete target.fn;
    // 返回函数的执行结果
    return res;
}

// 调用我们自己的apply方法
var name = foo.myApply(obj, [1, 2]);
console.log(name);
```

使用es6来实现apply方法：

```javascript
const obj = {
    name: 'lisi'
};
function foo(a, b) {
    console.log(this, a, b)
    return this.name;
}
Function.prototype.myApply = function(target, args) {
    if(typeof this !== 'function') {
        throw new Error('apply方法只能被函数调用')
    }
    const isArray = Array.isArray(args);
    const isType = typeof args;
    if(args && ['number', 'boolean', 'string'].includes(isType)) {
        throw new Error('apply方法的第二个参数不能是简单值类型')
    }
    if(target == null) {
        target = window
    }
    target.fn = this;
    const  res = isArray ? target.fn(...args) : target.fn();
    delete target.fn;
    return res;
}
const name = foo.myApply(obj, [1, 2]);
console.log(name);
```

## 三、bind

bind的用法相对于call和apply就稍稍复杂一点，有了前两个的使用基础，使用bind就不会太难

### 1. bind的用法

- bind方法的第一个参数将作为函数内部this的指向，返回一个新的函数newFn
- bind方法的剩余参数将和newFn传递的参数组合一起传递给当前函数，散列传递
- 调用newFn返回当前函数的执行结果
- `如果使用new来调用 newFn时，那函数内部的this将指向当前函数的实例对象，就不是指向bind方法的第一个参数`

```javascript
var obj = {
    name: 'lisi'
};
function Foo(a, b) {
    console.log(this, a, b)
    return this.name;
}
var newFn = Foo.bind(obj,1)
// var name = newFn(2);
// console.log(name);

//使用new来调用 newFn时，那函数内部的this将指向函数的实例对象
var newObj = new newFn(2, 3);
console.log(newObj instanceof Foo)
console.dir(newObj)
```

