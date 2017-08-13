---
title: Review your code
tags:
  - javascript
  - good-practices
date: 2016-04-08 13:37:33
---

As I finish writing this post, I will review it to check if I can structure it better or if I need to improve the way I am explaining my ideas, and of course for typos and mistakes. This should be the way you write code as well. You are not done when your code works, you are done when your code looks nice.
{% asset_img code-review.gif [Code review] %}

How many characters in length do you let your lines go? How well do you organise your code? Is your code open to future demands in features or will the team have to rewrite most of it from scratch? Take some pride on how your code looks.

Other people will see it and you might need to work on it again. When coming back to fix a bug you are not in the same mindset you were when first spending hours or days working on that feature. Review your code to leave it for the future you, so you can read it easily enough.

By spending some extra time reviewing what you did when your focus was to develop the logic of how things would work and taking care of bugs, you can focus on other important stuff. Did you miss a situation where a bug might show up later? Is your code good enough in case you need to extend it later?
<!-- more -->

I will try to bring it to a more practical scenario and review a real piece of code that I wrote. I like to keep my ajax calls to the server centralized, so in future when I need to change something on how the calls are made I have it all in one place, and not lost somewhere in the code.

There is a file called “api.js” in a project I am working on, if it grows too much I will split it into multiple files inside an “api” folder. But for now let’s just review it and check if we can make it better.
```javascript
const BASE = 'http://localhost:8000/api/v1';
const postOptions = {
  method  : 'POST',
  headers : { 'Content-Type': 'application/json' },
};

export const todos = {
  list: async () => {
    const response = await fetch(BASE + '/todos');
    
    if (response.status !== 200) {
      throw response;
    }
    
    return response.json();
  },
  create: async (payload) => {
    const response = await fetch(BASE + '/todos', {
      ...postOptions,
      body: JSON.stringify(payload)
    });

    if (response.status !== 200) {
      throw response;
    }

    return response.json();
  }
};

export const auth = {
  login: async (payload) => {
    const response = await fetch(BASE + '/auth/login', {
      ...postOptions,
      body: JSON.stringify(payload)
    });

    if (response.status !== 200) {
      throw response;
    }

    return response.json();
  }
};
```

You can see there that I keep the base url for the server on a string and some default options for when making a post call. I am [exporting](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/export) some objects that handles the calls separated by domains and uses the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Also some [async magic](https://jakearchibald.com/2014/es7-async-functions/) there and using the [spread operator](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_operator) to create new objects extending existing ones.

Let’s take it one improvement at a time. First let’s move what belongs into a configuration file to it’s place. Luckily I already have a config file set up.

```javascript
import config from './config';

const BASE = config.apiUrl;
const postOptions = {
  method  : 'POST',
  headers : { 'Content-Type': 'application/json' },
};

export const todos = {
  list: async () => {
    const response = await fetch(BASE + '/todos');
    
    if (response.status !== 200) {
      throw response;
    }
    
    return response.json();
  },
  create: async (payload) => {
    const response = await fetch(BASE + '/todos', {
      ...postOptions,
      body: JSON.stringify(payload)
    if (response.status !== 200) {
      throw response;
    }

    return response.json();
  }
};

export const auth = {
  login: async (payload) => {
    const response = await fetch(BASE + '/auth/login', {
      ...postOptions,
      body: JSON.stringify(payload)
    });

    if (response.status !== 200) {
      throw response;
    }

    return response.json();
  }
};
```

The API url is now being fetched from the configuration. But I am still calling fetch on a lot of places there, and when different api calls are necessary we will have even more fetch calls. That is not good, the same reasoning that makes me wanna keep all my ajax call on the same place makes me wanna avoid multiple calls to the same api (the fetch API in this case). If I ever need to update the way I am making this call I will have multiple ones, so let’s make it a single one and reuse that.

```javascript
import config from './config';

const BASE = config.apiUrl;

function get(path) {
  return async () => {
    const response = await fetch(BASE + path);

    if (response.status !== 200) {
      throw response;
    }

    return response.json();
  };
}

function post(path) {
  return async (payload) => {
    const response = await fetch(BASE + path, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify(payload)
    });

    if (response.status !== 200) {
      throw response;
    }

    return response.json();
  };
}

export const todos = {
  list: get('/todos'),
  create: post('/todos')
};

export const auth = {
  login: post('/auth/login')
};
```

I used [currying](http://www.sitepoint.com/currying-in-functional-javascript/) and [arrow functions](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions) to create functions that handles get and post calls to the api. Now we need to write much less code when creating a new call, and if I ever need to change the calls to add a dynamic variable such as api version or keys to the calls I just need to do that in the new get and post functions instead of fixing lots of repeated code.

But we still have a lot of code there that we have to get past when reading the file later and that will require low to zero maintenance, so we can move that somewhere else and transform this file into route declarations for api. I will create an API handling class in my lib folder.
```javascript
export default class Api {
  constructor (baseUrl) {
    this.baseUrl = baseUrl;
  }

  get(path) {
    return async () => {
      const response = await fetch(this.baseUrl + path);

      if (response.status !== 200) {
        throw response;
      }

      return response.json();
    };
  }

  post(path) {
    return async (payload) => {
      const response = await fetch(this.baseUrl + path, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(payload)
      });

      if (response.status !== 200) {
        throw response;
      }

      return response.json();
    };
  }
}
```

Now we can even handle multiple APIs by providing a different base url.

This is how it looks like now:

```javascript
import config from './config';
import Api from '../lib/api';

const api = new Api(config.apiUrl);

export const todos = {
  list: api.get('/todos'),
  create: api.post('/todos')
};

export const auth = {
  login: api.post('/auth/login')
};
```

That is way more maintainable, when someone needs to add a new route it’s way easier than before. Anyone that looks at it knows how to do it.

* * *

[Review your code](https://medium.com/@rbpinheiro/review-your-code-6e43da2f4aba) was originally published on Medium, where people are continuing the conversation by highlighting and responding to this story.