CountUp.js
==========

CountUp.js is a dependency-free, lightweight JavaScript "class" that can be used to quickly create animations that display numerical data in a more interesting way.

Despite its name, CountUp can count in either direction, depending on the `startVal` and `endVal` params that you pass.
<!-- as well as a coffeescript version, thanks to @HHSnopek. -->

CountUp.js supports all browsers.

##[Try the demo](http://inorganik.github.io/CountUp.js)

### Usage:

Params:
- `target` = id of html element, input, svg text element, or var of previously selected element/input where counting occurs
- `startVal` = the value you want to begin at
- `endVal` = the value you want to arrive at
- `decimals` = number of decimal places in number, default 0 (optional)
- `duration` = duration in seconds, default 2 (optional)
- `options` = formatting/easing options object (see demo, optional)

Decimals, duration, and options can be left out to use the default values.

```js
var numAnim = new CountUp("SomeElementYouWantToAnimate", 24.02, 99.99);
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

Toggle pause/resume:

```js
numAnim.pauseResume();
```

Reset an animation:

```js
numAnim.reset();
```

Update the end value and animate:

```js
var someValue = 1337;
numAnim.update(someValue);
```
