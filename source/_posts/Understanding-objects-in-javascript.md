---
title: Understanding objects in javascript
date: 2017-07-12 21:24:58
tags:
---

I wrote this post for those who are already familiar with object-oriented programming, and the intention is to explain language-especific implementations.

Javascript deals with objects in a very loose way, and the more time you spend working with it, more quirks you will find that you will need to get used to. What confuses most developers is how inheritance works, it's very different than most languages.
ES6 introduced a more classical inheritance approach to inheritance and will probably be easier to understand if you are struggling.
I will show you the newly available classical approach and the regular way of doing it in javascript and a few other things you should know about objects.

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
// 'Animal'

cat.printType();
// 'Cat'

cat.meow();
// 'meow'

animal.meow();
// Error TODO
```