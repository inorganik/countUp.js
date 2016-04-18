# CountUp.js
CountUp.js is a dependency-free, lightweight JavaScript "class" that can be used to quickly create animations that display numerical data in a more interesting way.

Despite its name, CountUp can count in either direction, depending on the `startVal` and `endVal` params that you pass.

CountUp.js supports all browsers.

##[Try the demo](http://inorganik.github.io/countUp.js)

## Installation

Simply include the countUp.js file in your project or install via npm or bower using the package name `countup.js`.

To contribute, please [read more here](contributing.md).

## Angular directive
Included is an angular module. Use the count-up attribute to quickly create an animation. It also integrates nicely with the angular-scroll-spy directive. The Angular directive only requires an `end-val` attribute, but will also accept `start-val`, `duration`, and `decimals`. `id` is not needed. You must include both countUp.js and the module to use the angular directive. **[Check out the angular demo](http://inorganik.github.io/angular-scroll-spy).**

## WordPress plugin
If you want a quick and easy way to use this on your WordPress site, try this plugin by [@4DMedia](https://twitter.com/4dMedia): [https://wordpress.org/plugins/countup-js/](https://wordpress.org/plugins/countup-js/)

## Usage:
Params:
- `target` = id of html element, input, svg text element, or var of previously selected element/input where counting occurs
- `startVal` = the value you want to begin at
- `endVal` = the value you want to arrive at
- `decimals` = (optional) number of decimal places in number, default 0
- `duration` = (optional) duration in seconds, default 2
- `options` = (see demo, optional) formatting/easing options object

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
#### Animating to large numbers
For large numbers, since the CountUp class has a long way to go in just a few seconds, the animation seems to abruptly stop. The solution is to subtract 100 from your endVal, then use the callback to invoke the `update` method which completes the animation with the same duration with a difference of only 100 to animate:
```js
var endVal = 9645.72;
var numAnim = new CountUp("targetElem", 0, endVal - 100);
numAnim.start(function() {
	numAnim.update(endVal);
});

```
#### Angular
```html
<h2 count-up end-val="873.4"></h2>
```
Width angular-scroll-spy:
```html
<h2 count-up id="numberAnimation" end-val="873.4" scroll-spy-event="elementFirstScrolledIntoView" scroll-spy></h2>
```

## Other methods:
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

## Custom easing:

You can apply your custom easing function, which will receive standard 4 parameters necessary
to calculate Bezier curve:

- `t` (the current time);
- `b` (the beginning value);
- `c` (the change between the beginning and destination value);
- `d` (the total time of the tween).

So, for instance, you could use bodies of easing functions from jQuery's [easing plugin](http://gsgd.co.uk/sandbox/jquery/easing/).
Pass in the body of the function and you're good to go :)

Just don't use any "bouncy" functions, as they tend to cause issues and are controlled not to exceed max value by the library.

If you don't specify a custom easing closure function, the plugin will fall back to the default `easeOutExpo`.

#### Example:

```js
var easeOutCubic = function(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (1.77635683940025e-15 * tc * ts + 0.999999999999998 * tc + -3 * ts + 3 * t);
};
var options = {
  easingFn: easeOutCubic
};
var demo = new CountUp("myTargetElement", 24.02, 94.62, 2, 2.5, options);
demo.start();
```


## MIT License
