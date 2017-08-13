---
title: How orthogonality can make you a better developer
tags:
---

{% asset_img better-dev.gif [Developer ascending] %}
Orthogonality, in the programming context, means that a piece of code can be easily changed without causing side-effects, or at least keeping them to a minimum.
Think about your phone, it allows you to switch from mobile data to wi-fi and your apps should work seamlessly on either without noticing much difference. That is very orthogonal.
Your phone also have an airplane mode, that will switch off your mobile data, wi-fi, bluetooth and even telephony. That is a list of side-effects for you, not orthogonal at all.
Ever had to switch from a database management system to another? Say switching from Postgres to MariaDB.
You might be using an orthogonal ORM that will let you do that by changing a value on a string. Or you might be using the non-orthogonal approach of using the driver itself, in which case you will need to rewrite a lot of code.
<!-- more -->
CSS is another case of lack of orthogonality, and what mayhem it causes. That is why you have BEM, css modules and all the other efforts to make it more modular and reduce side-effects.
{% asset_img css.gif [Peter Griffin struggling with window blinds - css meme] %}
A long time ago I was working on a website with ajax calls scattered all around it. It was back when jQuery was still the king of the web and ajax was as fancy as using words such as "orthogonality". It wasn't untill the backend url I needed to call started changing and having multiple versions, for development and production, and I needed to go around different files to change it that the lack of orthogonality on my ajax calls implementations started to bother me.
What should I have done better? Save the base url on a variable? Somehow make it easy to switch between development and production mode?
Here are a few good practices that can increase orthogonality in your projects and help you build better software.

## Config files by environment
You usually have a few values that will be the same during all your software execution, but that you might wanna set it's value before starting it. Such is the case for an API url or database connection configuration. 
You will want these values to be centralised, not lost at a random place inside your project. You don't want to have to remember all your code and structure to remember where a variable that should be a configuration is.
The values usually change accordingly to the environment, you point to your local instance of the api when running on localhost, but to another instance when running on a test server and to another on production.
Nodejs have a great package named [config](https://www.npmjs.com/package/config), very simple and does the job really well.

## Small modules and functions
Separate your code into small pieces that accomplishes simple tasks and use them as building blocks for more complex stuff.
You can see this approach frequently in the javascript ecosystem. React stands on it's [own package](https://www.npmjs.com/package/react) for the core logic, but uses a [separate package](https://www.npmjs.com/package/react-dom) to connect to the DOM. Redux also have it's [own package](https://www.npmjs.com/package/redux) for core logic, and a [separate package](https://www.npmjs.com/package/react-redux) to connect to react.
You don't need to separate your code into different projects, but split it up logically on smaller functions. If you have a big function that does a lot of stuff, and you need a piece of that logic for another part of your system you will end up copying and pasting or implementing it again.

## Composition
Building up on the previous item, composition is a simple yet powerful concept.
React played around with inheritance and mixins before settling with composition as the default way to extend components via [Higher-Order Components](https://facebook.github.io/react/docs/higher-order-components.html).
Function composition is getting more popular lately as functional programming gains more popularity.
Ramda does a great job with the [compose](http://ramdajs.com/docs/#compose) and [pipe](http://ramdajs.com/docs/#pipe) functions. Also we might have it available as a language feature soon, check this [proposal](https://github.com/tc39/proposal-pipeline-operator).

## Proxy pattern
It's usually a good idea to wrap with your own code an API that will be used multiple times in your project. A great example of this is the React's virtual dom, it creates an abstraction on top of the resource expensive browser DOM and implements a better way of handling html manipulation.
Going back to my early example, imagine you are on a project with around 15 ajax calls on several different files. Using [fetch](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch) this time, because 2017.
Suddenly the API changes and you need to send a token via header to identify your app.
So you go from this:
```javascript
fetch('https://www.api.com/endpoint')
.then(function(response) {
  // Logic
});
```
To this:
```javascript
const headers = new Headers();
headers.append('app-id', '123');

const fetchConfig = {
  method: 'GET',
  headers: headers,
};

fetch('https://www.api.com/endpoint', fetchConfig)
.then(function(response) {
  // Logic
});
```
Not too complex, but you need to search all your files to change that all around. And might even forget to change it somewhere causing a bug.

A better approach would be to have your wrapper around fetch in the first place:
```javascript
function fetchAPI(endpoint, callback) {
  const headers = new Headers();
  headers.append('app-id', '123');

  const fetchConfig = {
    method: 'GET',
    headers: headers,
  };

  fetch(`https://www.api.com/${endpoint}`, fetchConfig)
  .then(callback);
}
```
This way you could just change anything you want in there and it applies to every API call.
For a more in-depth look at this approach check this [other post](/blog/2016/04/08/Review-your-code).


## Adapter pattern
This approach is widely used by ORMs, you just need to setup a common ground or contract between different implementations so they seems to work the same.
This is implemented by using a function that takes the same parameters and returns something that follows the same rules, or an object or class that implements the same methods.
Take [sequelize](http://docs.sequelizejs.com/) as an example, the getting started guide shows us that we can choose the DBMS by changing a string. Easy, right?
```javascript
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
});
```

The underlying implementation, if you check the [source code](https://github.com/sequelize/sequelize/tree/master/lib/dialects), is done on a folder named dialects which contains the adapters.
If we compare the code for the postgres dialect (partially suppressed for brevity's sake):
```javascript
class PostgresDialect extends AbstractDialect {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.connectionManager = new ConnectionManager(this, sequelize);
    this.QueryGenerator = _.extend({}, QueryGenerator, {
      options: sequelize.options,
      _dialect: this,
      sequelize
    });
  }
}

PostgresDialect.prototype.supports = _.merge(_.cloneDeep(AbstractDialect.prototype.supports), {
  ...
});

ConnectionManager.prototype.defaultVersion = '9.4.0';
PostgresDialect.prototype.Query = Query;
PostgresDialect.prototype.DataTypes = DataTypes;
PostgresDialect.prototype.name = 'postgres';
PostgresDialect.prototype.TICK_CHAR = '"';
PostgresDialect.prototype.TICK_CHAR_LEFT = PostgresDialect.prototype.TICK_CHAR;
PostgresDialect.prototype.TICK_CHAR_RIGHT = PostgresDialect.prototype.TICK_CHAR;

module.exports = PostgresDialect;
```
And the code for mysql's dialect (also):
```javascript
class MysqlDialect extends AbstractDialect {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.connectionManager = new ConnectionManager(this, sequelize);
    this.QueryGenerator = _.extend({}, QueryGenerator, {
      options: sequelize.options,
      _dialect: this,
      sequelize
    });
  }
}

MysqlDialect.prototype.supports = _.merge(_.cloneDeep(AbstractDialect.prototype.supports), {
  ...
});

ConnectionManager.prototype.defaultVersion = '5.6.0';
MysqlDialect.prototype.Query = Query;
MysqlDialect.prototype.QueryGenerator = QueryGenerator;
MysqlDialect.prototype.DataTypes = DataTypes;
MysqlDialect.prototype.name = 'mysql';
MysqlDialect.prototype.TICK_CHAR = '`';
MysqlDialect.prototype.TICK_CHAR_LEFT = MysqlDialect.prototype.TICK_CHAR;
MysqlDialect.prototype.TICK_CHAR_RIGHT = MysqlDialect.prototype.TICK_CHAR;

module.exports = MysqlDialect;
```
You can see all the properties that are exposed with the same name, and even with the underlying code being different, you could just call those functions not caring if you are dealing with mysql or postgres.

## Facade pattern
The facade pattern is pretty simple, but it can simplify many implementations. You probably have already done something that fits the description, you might even argue that my previous function on "Wrap libs in your own code" is a facade.
Not rarely you need to interface with a number or different APIs or libraries to do something that, for your system, is one single thing.
Imagine that you need to load a list of nearby places for a mobile app you are building. That takes two steps, getting the user location and calling an API such as Google Places API that can return you that list. Maybe you have a few alternatives on how to get the user location, try geolocation, last known place or try to guess from the IP. The Google API might not return you all the results that you want, and you need to fetch results from more than one place, it can always grow in complexity.
Doing all that in the same place as you do the UI logic might get too complex. So you can introduce a facade, a separate object that will take care of abstracting all the implementation and expose a method named "fetchNearbyPlaces". That is way more readable and maintainable than having it mixed with your UI logic.

## Mediator pattern
The mediator pattern is useful for more specific cases than the patterns presented before. It consists of an object that manages several other objects, passing messages between them and specifying what information each child object has access to.
This is useful for managing dynamic dashboards or forms, where the mediator receives a JSON, and decides which widgets to render and where. Another useful applications is for chatrooms, where the mediator is the room itself and the users are the mediator's children.
Addy Osmani published a [mediator gist](https://gist.github.com/addyosmani/1794823) if you wanna see an example.

## Pub/Sub pattern
The publish/subscribe pattern provides very loose coupling and is very good for modular architectures. Heavily used to comunicate between microservices. It works by providing a central way of comunication, where your modules can publish messages to channels and any other module that subscribed to that channel will receive it. It provides loose coupling because when you publish a message, you have no idea of who will be listening to it. And the same applies for subscribers, that will not know who publishes messages to that channel. Also, multiple modules might be listening to the same channel, so it's great to coordinate multiple actions from different modules due the same state change.
It's worth noting that this loose coupling adds some complexity to debbuging, because you have no clear way of knowing what will happen after you publish a message.
[David Walsh](https://twitter.com/davidwalshblog) published a simple implementation that you can find on [his page](https://davidwalsh.name/pubsub-javascript). Node exposes an ["events" API](https://nodejs.org/dist/latest-v8.x/docs/api/events.html#events_events) for that as well. And for communications between different services you could use [Redis](https://redis.io/topics/pubsub), [RabbitMQ](https://www.rabbitmq.com/) or [Apache Kafka](https://kafka.apache.org/).


## Observer
