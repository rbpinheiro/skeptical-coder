---
title: Understanding objects in javascript
date: 2017-08-06 13:23:58
tags:
  - javascript
  - object-oriented
  - prototype
  - ES6
---

I wrote this post for those who are already familiar with object-oriented programming, and the intention is to explain language-especific implementations.

Javascript deals with objects in a very loose way, and the more time you spend working with it, more quirks you will find that you will need to get used to. What confuses most developers is how inheritance works, it's very different than most languages.
ES6 introduced a more classical approach to inheritance and will probably be easier to understand if you are struggling.
I will show you the newly available classical approach and the regular way of doing it in javascript, then a few other things you should know about objects.

{% asset_img main.png [ES6 classical syntax-sugar vs Prototype] %}
<!-- more -->

## ES6 classical syntax-sugar


```javascript
class Animal {
  constructor(type = 'Animal') {
    this.type = type;
  }

  printType() {
    console.log(this.type);
  }
}


class Cat extends Animal {
  constructor() {
    super('Cat');
  }

  meow() {
    console.log('meow');
  }
}

const animal = new Animal();
const cat = new Cat();

animal.printType();
// "Animal"

cat.printType();
// "Cat"

cat.meow();
// "meow"

animal.meow();
// TypeError: animal.meow is not a function
```

It's pretty straight forward if you are used to a classic inheritance model. The 'class' keyword is used to define a class that we can create new instances from. The 'extends' keyword is used to define inheritances, a way to use the previous class and add or modify stuff while keeping the original class untouched. The 'new' keyword is used to create a new instance of a class.
In most classic inheritance languages the instance is an object, and the class is something different, it's just a blueprint for the instances. Javascript doesn't really have the concept of a class in that sense. The 'class' keyword here will actually be creating a function with a prototype, and that's why I said it's a syntax-sugar.

## Prototype way

```javascript
function Animal(type) {
  this.type = type || 'Animal';
}

Animal.prototype.printType = function() {
  console.log(this.type);
};

function Cat(type) {
  Animal.call(this, 'Cat');
}

Cat.prototype = Object.create(Animal.prototype);

Cat.prototype.meow = function() {
  console.log('meow');
}

const animal = new Animal();
const cat = new Cat();

animal.printType();
// 'Animal'

cat.printType();
// 'Cat'

cat.meow();
// 'meow'

animal.meow();
// Error TODO
```

Javascript uses a prototypal inheritance method, so instead of using a 'class', it uses a 'prototype' property attached to a function. The 'new' keyword creates a new object using as blueprint the function's prototype and using the function it self as the constructor.
A few things might look weird here if you are used to a more classic approach:
  * A function can use the 'this' keyword to read and write properties onto itself, just like an object would. And that is because functions are objects too, in fact they are an instance of the 'Function' object;
  * Instead of the 'super' keyword, we use a 'call' method present on the function to execute the parent constructor. The first argument will the instance it will modify, we use the 'this' keyword to pass the current function and all the next arguments will be just regular arguments you would pass to the parent function;
  * You can assign a function to a property or variable, actually you can even pass it around as a function's argument. This is because javascript treats function as a first class citizen, meaning that functions are handled like a string, a number or an object. This is pretty straight-forward in javascript because functions are already objects anyway;
  * Also, you don't need to name your functions. You can just create an anonymous function and assign it to a variable or do whatever you would do to an object.
Besides inheritance there a few other things you could do to objects in javascript.
  
## Literal object

```javascript
const cat = {
  type: 'Cat',
  meow: function () {
    console.log('meow');
  }
};
```
You can just create an object without a blueprint if you want. The syntax is pretty simple, not much explaining to do.
If you got ES6 enabled you can write the function in a cleaner way.

```javascript
const cat = {
  type: 'Cat',
  meow() {
    console.log('meow');
  }
}
```

## Self-constructing object

```javascript
const Cat = function() {
  this.type = 'Cat';
  this.meow = function() {
    console.log('meow');
  };

  function privateMethod() {
    // Does some private stuff
  }

  return this;
};

const cat = Cat();
```

Using the fact that functions are objects we can use the function itself as a constructor and blueprint. Each function call will actually create a new instance.
Since the body of a function is a separate scope, the 'privateMethod' function will not be acessible outside of the main function. Everything attached to 'this' will be public.


## Reveal pattern

```javascript
const cat = (function() {
  function meow() {
    console.log('meow');
  }

  function privateMethod() {
    // Does some private stuff
  }

  return {
    type: 'Cat',
    meow: meow,
  };
})();
```

Pretty similar to the previous one, but by creating a new literal object instead of using the function itself we will end up with a cleaner object.
Instead of defining and saving the blueprint in a variable 'Cat', I just created an imediately-invoked function expression (IIFE for short). You can do that by adding '()' after the function body. It just means that you will execute that function right after it was created.

## Module Revealing Pattern

```javascript
const Animals = {};

Animals.cat = (function() {
  function meow() {
    console.log('meow');
  }

  function privateMethod() {
    // Does some private stuff
  }

  return {
    type: 'Cat',
    meow: meow,
  };
})();

Animals.dog = (function() {
  function woof() {
    console.log('woof');
  }

  function privateMethod() {
    // Does some private stuff
  }

  return {
    type: 'Dog',
    woof: woof,
  };
})();

```

This pattern builds up on the previous one.
We are just gathering the objects on a centralyzing literal object. On this example I already created a standalone cat object, but you could create a function or prototype blueprint and reveal that so you can create as many instances as you want.
This pattern is losing some relevance as ES6 becomes more popular because of the import and export features that were added enabling a module per file.
It is especially useful if your are using an ES5 envorinment where every variable created outside of a function (or even inside if you don't use 'var' or 'const'), is global to the whole project and to every other script that will be loaded, third-part or not.
This way you can build a big project without poluting the global escope, you could just create an 'app' object and use this pattern to populate it with a deep tree-like structure composed by modules.
  
Those are, I believe, the most important aspects of dealing with objects in javascript.
Still find something hard to understand?
Did I miss anything important?
Comments are below!