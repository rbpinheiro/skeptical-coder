---
title: Writing readable code
tags:
  - programming
  - bugs
  - good-practices
date: 2015-11-17 17:32:37
---

When you are starting on something, be it coding or anything else, more experienced people will give you tips so you can avoid future problems, but many times we will ignore those tips because it doesn’t make sense. Till it does, and you regret not doing it right in the first place while you pull your hair off trying to fix things.

A few years ago I worked on a project that had a few dev teams working together, but each on a different part of the world. A developer from another team was leaving and my team was gonna become responsible for an old software that he was maintaining. Said software was written on a language that I was not used to work with and was using a framework that was long outdated. Fun, right?

I had to look around in the code for where I should work to fulfil my first task. When I found it, I stood there looking at it for a few minutes, probably, without blinking. If this piece of code were a painting, it would be the restored version of Ecce homo.
<figure>![](https://cdn-images-1.medium.com/max/630/1*p1VPeGfOUNzU-P3_lGfztA.jpeg)<figcaption>Ecce homo</figcaption></figure>
<!-- more -->

The code, if my memory serves me well, was something like this:

```php
<?
$tmp = $application->prepare2();
if ($tmp[2]) {
  // more bad code
} else {
  // even worse code
}
```

I have no idea of what this code does, you have no idea of what this code does, and about a week after writing it, the developer who wrote it had no idea of what this code does. After a lot of swearing and debugging I was able to finally follow the code and modify what was needed, but if someone did good code in first place, I wouldn’t spend so much time on it.

If you think that writing code is hard, as soon as bug reports or change requests comes you will realise that reading it is much harder, and that you should have spent a few more minutes to do it properly.

Writing readable code will make you write less bugs and fix the existing ones way faster. Here are some tips on how to do it:

## Meaningful names

As you can see from the code up there, the names of variable and methods should, at least, give a tip of what is contained inside of them or of what they do. Avoid variables like “tmp”, “str”, “val” and any that does not describe what is contained in them.

## Don’t reuse variables

Everyone makes the mistake of reusing a variable so they will save memory by not creating a new one or just out of laziness. But that is confusing to whom reads your code, and if you do that inside for loops or some asynchronous code, the chance of you creating a bug are huge.

## Declare variables at the top

When all your variables are declared at the top of the function, the developer who reads it will have a pretty good idea of what it does and how it does it. New variables in the middle of the code makes it confusing and more mysterious.

## Initialise variables

There is no clearer variable declaration than one with a meaningful name and a default value, specially if your language does not declare the type of the variable explicitly.

Each language treats uninitialised variables differently, causing a different number of bugs on each. You can check the language you work with for potential bugs, or just write better code with initialised variables.

## Small functions

Break your code into small functions that does one thing only. It is easier to understand a meaningful function name being called than having to read your whole code to understand it.

Simplicity is the key for understandable code.

## Use return to avoid else

You will usually have situations where you should do something if your function argument fits a condition, and do something else if it doesn’t. Giving that your code is divided in small enough functions, you can just do something if that condition is met and return the value inside the if. If the condition is not met your code will continue to execute without the need for an else statement.

That will avoid deeper nesting.

Example:
```javascript
function a(x) {
  if (x > 2) {
    return 0;
  }

  return x;
}
```

## Use proper indentation

Following the right indentation and the same pattern of indentation over the code will make you eyes scan the code way faster than if you have to check every line for what block of code it belongs.

## Avoid globals

Modifying globals will cause side-effects that are not easy to identify, plus you never know the value of that global inside the scope you are currently in.

## Pure functions

A function is pure if it does not produce any side-effects and does not depends on external conditions such as global variables. All the input should be given via the function’s arguments, and any number of times you give a pure function the same arguments, it will return the same output. That is possible only if you don’t depend on external conditions. This kind of function is predictable and won’t give you surprises, use them whenever possible.

## Don’t use shorthands

The most common shorthand used is the if statement without brackets, because your code will fit in the next line. As soon as your code don&#39;t fit in a line, you might insert more lines of code that will seem to be inside the if block, but they aren’t. Even assuming you are testing your changes to the code, on some situations the undesired effect will not show on that specific test, or you will lose some time debugging your code only to feel stupid when you see that you missed some brackets.

This is bad:
```javascript
function a(x) {
  if (x > 2)
    return 0;

  return x;
}
```

## Return the callback

If the language you are using supports first-class functions, meaning that you can send a function as an argument to another function and call it back with the results instead of returning it, always use a return statement to end the function execution there. You avoid that any undesired code gets executed after you finished what you were doing and the syntax highlight of your editor will make the return statement very visible, so you can identify a lot quicker the exit points of your function.

## Avoid loops

If your language have minimal support for functional programming, at least supporting the map or foreach functions, prefer using that over for and while loops. If you are creating or modifying an array or object inside a loop, your data will be in different dirty states till it is finished. Plus you will need more auxiliary variables and more accessing of array via index.

## Follow the project’s style

You can argue whether you should include the brackets on the same line or not, whether you should use camel-case or not, whether you use tabs or space for indentation, but you can’t use your own style over the current one for a project you are starting at. Mixed style’s will only lead to confusing code.

Any other tips you think that should have made this list? Don’t agree with any of them?

***

[Writing readable code](https://medium.com/@rbpinheiro/writing-readable-code-3ef226dfa2) was originally published on Medium, where people are continuing the conversation by highlighting and responding to this story.