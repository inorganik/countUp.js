countUp.js
==========

countUp.js is a dependency-free, lightweight JavaScript "class" that can be used to quickly create animations that display numerical data in a more interesting way. 

Despite its name, countUp can count in either direction, depending on the `startVal` and `endVal` params that you pass.
<!-- as well as a coffeescript version, thanks to @HHSnopek. -->

countUp.js supports all browsers. 

##[Try the demo](http://inorganik.github.io/countUp.js)

### Usage:

Params:
- `target` = id of html element, input, svg text element, or var of previously selected element/input where counting occurs
- `startVal` = the value you want to begin at
- `endVal` = the value you want to arrive at
- `decimals` = number of decimal places in number, default 0
- `duration` = duration in seconds, default 2
- `options` = object that determines number formatting and toggles easing - see demo

Decimals, duration, and options can be left out to use the default values.

```js
var numAnim = new countUp("SomeElementYouWantToAnimate", 24.02, 99.99);
numAnim.start();
```

with optional callback:

```js
numAnim.start(someMethodToCallOnComplete);

// or an anonymous function
numAnim.start(function() {
	// do something
})
```

### Other methods:

Stop an animation in progress:

```js
numAnim.stop();
```

Resume a stopped animation:

```js
numAnim.resume();
```

Reset an animation:

```js
numAnim.reset();
```
