# CountUp.js
CountUp.js is a dependency-free, lightweight JavaScript "class" that can be used to quickly create animations that display numerical data in a more interesting way.

Despite its name, CountUp can count in either direction, depending on the `startVal` and `endVal` params that you pass.

CountUp.js supports all browsers.

## [Try the demo](http://inorganik.github.io/countUp.js)

## Installation

Simply include the countUp.js file in your project or install via npm or bower using the package name `countup.js` or `countUp.js` respectively.

Before making a pull request, please [read this](#contributing). MIT License.

## Angular directive
If you are using Angular, you can use the included Angular module. Use the count-up attribute to quickly create an animation. It also integrates nicely with the Angular-scroll-spy directive. The Angular directive only requires an `end-val` attribute, but will also accept `start-val`, `duration`, `decimals`, and `options`. `id` is not needed. You must include both countUp.js and the module to use the Angular directive. **[Check out the angular demo](http://inorganik.github.io/angular-scroll-spy/)** and see usage examples below.

## Angular 2 directive
An identical Angular 2 version of the directive compatible with version ^2.0.0 is also provided.
Simply import the module from `dist/` into your application module's `imports` array. See example below.

## jQuery
A jQuery version is also included in case you like dollar signs.

## WordPress plugin
Add CountUp to your WordPress site with this plugin: [https://wordpress.org/plugins/countup-js/](https://wordpress.org/plugins/countup-js/)

## Usage:
Params:
- `target` = id of html element, input, svg text element, or var of previously selected element/input where counting occurs
- `startVal` = the value you want to begin at
- `endVal` = the value you want to arrive at
- `decimals` = (optional) number of decimal places in number, default 0
- `duration` = (optional) duration in seconds, default 2
- `options` = (optional, see demo) formatting/easing options object

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

#### Other methods:
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

#### Animating to large numbers
For large numbers, since CountUp has a long way to go in just a few seconds, the animation seems to abruptly stop. The solution is to subtract 100 from your `endVal`, then use the callback to invoke the `update` method which completes the animation with the same duration with a difference of only 100 to animate:
```js
var endVal = 9645.72;
var numAnim = new CountUp("targetElem", 0, endVal - 100, duration/2);
numAnim.start(function() {
	numAnim.update(endVal);
});
```

#### Angular
*If you are using Angular*, (not required), create your animation like the examples below. Make sure you include both countUp.js and angular-countUp.js, and inject the `countUpModule`.

```html
<h2 count-up end-val="873.4"></h2>
```
With [angular-scroll-spy](http://inorganik.github.io/angular-scroll-spy/):
```html
<h2 count-up id="numberAnimation" end-val="873.4" scroll-spy-event="elementFirstScrolledIntoView" scroll-spy></h2>
```

#### Angular 2

The directive is compatible with Angular version ^2.0.0. Make sure `countUp.js` is loaded as a global dependency during bootstrapping.

Note the value for the `options` parameter is passed directly to the directive attribute selector.

```ts
import {Component, NgModule} from '@angular/core';

import {CountUpModule} from 'countup.js/dist/countUp.module';

@NgModule({
   imports: [CountUpModule],
   bootstrap: [AppComponent]
})
export class AppModule {}

// ...
// ...
// Use in some component contained within the importing module...

@Component({
   selector: 'counting-header',
   template: `
        <h1 countUp="{useEasing: false}"
            [startVal]="myStartVal"
            [endVal]="myEndVal"
            [reanimateOnClick]="false"></h1>
   `
})
export class CountingHeaderComponent {
    @Input()
    myStartVal: number;

    @Input()
    myEndVal: number;
}
```

#### Custom easing:

You can optionally apply your custom easing function, which will receive 4 parameters necessary to calculate a Bezier curve:

- `t` (the current time);
- `b` (the beginning value);
- `c` (the difference between the beginning and destination value);
- `d` (the total time of the tween).

You could use any of Robert Penner's [easing functions](https://github.com/danro/jquery-easing/blob/master/jquery.easing.js). Just avoid using "bouncy" functions, because they cause counting in both directions

If you don't specify a custom easing function, CountUp uses the default `easeOutExpo`.

Example:

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

## Contributing <a name="contributing"></a>

Before you make a pull request, please be sure to follow these super simple instructions:

1. Do your work on the `countUp.js` and/or other files in the root directory.
2. In Terminal, `cd` to the `countUp.js` directory.
3. Run `npm install`, which installs gulp and its dependencies.
4. Run `gulp`, which copies and minifies the .js files to the `dist` folder.
