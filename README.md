# CountUp.js
CountUp.js is a dependency-free, lightweight Javascript class that can be used to quickly create animations that display numerical data in a more interesting way.

Despite its name, CountUp can count in either direction, depending on the start and end values that you pass.

CountUp.js supports all browsers. MIT license.

## [Try the demo](http://inorganik.github.io/countUp.js)

---

## New in 2.0

- Completely rewritten in **Typescript**! The distributed code is still Javascript.
- **New** cleaner [method signature](#example).
- Tests with **Jest**. As much code coverage as possible mocking requestAnimationFrame.
- **Smart easing**: CountUp intelligently defers easing until it gets close enough to the end value for easing to be visually noticeable. Configureable in the [options](#options).
- **Separate bundles** for with and without the requestAnimationFrame polyfill. Choose `countUp.min.js` for modern browsers or `countUp.withPolyfill.min.js` for IE9 and older, and Opera mini.

CountUp is now distributed as a ES6 module - [see below](#including) for how to include it in your project.

## See Also

- **[CountUp.js Angular ^2 Module](https://github.com/inorganik/countUp.js-angular2)**
- **[CountUp.js Angular 1.x Module](https://github.com/inorganik/countUp.js-angular1)**
- **[CountUp.js React](https://github.com/glennreyes/react-countup)**
- **[CountUp.js Vue component wrapper](https://github.com/xlsdg/vue-countup-v2)**
- **[CountUp.js WordPress Plugin](https://wordpress.org/plugins/countup-js/)**
- **[CountUp.js jQuery Plugin](https://gist.github.com/inorganik/b63dbe5b3810ff2c0175aee4670a4732)**

---

## Usage:

**On npm**: `countup.js`

**Params**:
- `target: string | HTMLElement | HTMLInputElement` - id of html element, input, svg text element, or DOM element reference where counting occurs
- `endVal: number` - the value you want to arrive at
- `options?: CountUpOptions` - optional configuration object for fine-grain control

**Options** (defaults in parentheses): <a name="options"></a>

```ts
interface CountUpOptions {
  startVal?: number; // number to start at (0)
  decimalPlaces?: number; // number of decimal places (0)
  duration?: number; // animation duration in seconds (2)
  useGrouping?: boolean; // example: 1,000 vs 1000 (true)
  useEasing?: boolean; // ease animation (true)
  smartEasingThreshold?: number; // smooth easing for large numbers above this if useEasing (999)
  smartEasingAmount?: number; // amount to be eased for numbers above threshold (333)
  separator?: string; // grouping separator (',')
  decimal?: string; // decimal ('.')
  // easingFn: easing function for animation (easeOutExpo)
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  formattingFn?: (n: number) => string; // this function formats result
  prefix?: string; // text prepended to result
  suffix?: string; // text appended to result
  numerals?: string[]; // numeral glyph substitution
}
```

**Example usage**: <a name="example"></a>

```js
const countUp = new CountUp('targetId', 5234);
if (!countUp.error) {
  countUp.start();
} else {
  console.error(countUp.error);
}
```

Pass options:
```js
const countUp = new CountUp('targetId', 5234, options);
```

with optional callback:

```js
countUp.start(someMethodToCallOnComplete);

// or an anonymous function
countUp.start(() => console.log('Complete!'));
```

**Other methods**:

Toggle pause/resume:

```js
countUp.pauseResume();
```

Reset the animation:

```js
countUp.reset();
```

Update the end value and animate:

```js
countUp.update(989);
```
---

## Including CountUp <a name="including"></a>

CountUp v2 is distributed as an ES6 module because it is the most standardized and most widely compatible module for browsers. For compatibility with IE and older versions of Firefox (< 60), if you are not using a build tool, you will need a [module loader polyfill](https://github.com/ModuleLoader/browser-es-module-loader). You can read more about ES6 modules, using the module polyfill and more [here](https://www.sitepoint.com/using-es-modules/). If you are interested in a different module wrapping, you could install a previous release because I've experimented with many of them. The CountUp code is the same; the module wrappings were changed.

- UMD - `npm i countup.js@2.0.0`.
- AMD - `npm i countup.js@2.0.1`.
- commonjs - `npm i countup@2.0.3`.

For the examples below, first install CountUp. This will give you the latest:
```
npm i countup.js
```

### Example with vanilla js
This is what I used in the demo. Checkout index.html and demo.js.

main.js:
```js
import { CountUp } from './js/CountUp.min.js';

window.onload = function() {
  var countUp = new CountUp('target', 2000);
  countUp.start();
}
```

Include in your html. Notice the `type` attribute:
```
<script src="./js/countUp.min.js" type="module"></script>
<script src="./main.js" type="module"></script>
```
🎉 Done! Keep in mind to run locally you'll need a simple local server setup like [this](https://www.npmjs.com/package/http-server) (test the demo locally by running `npm run serve`) because otherwise you may see a CORS error when your browser tries to load the script as a module.

### Example with Webpack

main.js:
```js
import { CountUp } from 'countup.js';

window.onload = function () {
  var countUp = new CountUp('countup', 2000);
  countUp.start();
}
```
🎉 Done!

_If you have included CountUp in another type of project and want to help the community, please add it to the README and make a PR._

---

## Contributing <a name="contributing"></a>

Before you make a pull request, please be sure to follow these instructions:

1. Do your work on `src/countUp.ts`
1. Run tests: `npm t`
1. Run `npm run build`, which copies and minifies the .js files to the `dist` folder.
1. Serve the demo by running `npm run serve` and visit http://localhost:8080 to make sure it counts.
