# CountUp.js
CountUp.js is a dependency-free, lightweight Javascript class that can be used to quickly create animations that display numerical data in a more interesting way.

Despite its name, CountUp can count in either direction, depending on the start and end values that you pass.

CountUp.js supports all browsers. MIT license.

## [Try the demo](https://inorganik.github.io/countUp.js)

Or tinker with CountUp in [Stackblitz](https://stackblitz.com/edit/countup-typescript)

## Jump to:

- **[Features](#features)**
- **[Usage](#usage)**
- **[Including CountUp](#including-countup)**
- **[Contributing](#contributing)**
- **[Creating Animation Plugins](#creating-animation-plugins)**


## CountUp for frameworks and plugins:

- **[CountUp.js with Angular 2+](https://github.com/inorganik/ngx-countUp)**
- **[CountUp.js with Angular 1.x](https://github.com/inorganik/countUp.js-angular1)**
- **[CountUp.js with React](https://gist.github.com/inorganik/2cf776865a4c65c12857027870e9898e)**
- **[CountUp.js with Svelte](https://gist.github.com/inorganik/85a66941ab88cc10c5fa5b26aead5f2a)**
- **[CountUp.js Vue component wrapper](https://github.com/xlsdg/vue-countup-v2)**
- **[CountUp.js WordPress Plugin](https://wordpress.org/plugins/countup-js/)**
- **[CountUp.js with jQuery](https://gist.github.com/inorganik/b63dbe5b3810ff2c0175aee4670a4732)**


## Features
- **Animate when element scrolls into view** - new in v2.1.0. Use option `enableScrollSpy`.
- **Highly customizeable** with a large range of options, you can even substitute numerals.
- **Smart easing**: CountUp intelligently defers easing until it gets close enough to the end value for easing to be visually noticeable. Configureable in the [options](#options).
- **Separate bundles** for modern and legacy browsers, with and without the requestAnimationFrame polyfill. Choose `countUp.min.js` for modern browsers or `countUp.withPolyfill.min.js` for IE9 and older, and Opera mini.

## Usage:

**On npm** as: `countup.js`. You can import as a module or include the UMD script and access CountUp as a global. See [detailed instructions](#including-countup) below.

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
  useIndianSeparators?: boolean; // example: 1,00,000 vs 100,000 (false)
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
  enableScrollSpy?: boolean; // start animation when target is in view
  scrollSpyDelay?: number; // delay (ms) after target comes into view
  scrollSpyOnce?: boolean; // run only once
  onCompleteCallback?: () => any; // gets called when animation completes
  plugin?: CountUpPlugin; // for alternate animations
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
const countUp = new CountUp('targetId', 5234, { onCompleteCallback: someMethod });

// or (passing fn to start will override options.onCompleteCallback)
countUp.start(someMethod);

// or
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

### Animate when the element is scrolled into view

Use the scroll spy option to animate when the element is scrolled into view. When using scroll spy, just initialize CountUp but do not call start();

```js
const countUp = new CountUp('targetId', 989, { enableScrollSpy: true });
```

**Troubleshooting scroll spy**

CountUp checks the scroll position as soon as it's initialized. So if you initialize it before the DOM renders and your target element is in view before any scrolling, you'll need to re-check the scroll position after the page renders:

```js
// after DOM has rendered
countUp.handleScroll();
```
---

## Including CountUp

CountUp is distributed as an ES6 module because it is the most standardized and most widely compatible module for browsers, though a UMD module is [also included](#umd-module).

For the examples below, first install CountUp. This will give you the latest:
```
npm i countup.js
```

### Example with vanilla js
This is what I used in the demo. Checkout index.html and demo.js.

main.js:
```js
import { CountUp } from './js/countUp.min.js';

window.onload = function() {
  var countUp = new CountUp('target', 2000);
  countUp.start();
}
```

Include in your html. Notice the `type` attribute:
```html
<script src="./main.js" type="module"></script>
```

To support IE and legacy browsers, use the `nomodule` script tag to include separate scripts that don't use the module syntax:

```html
<script nomodule src="js/countUp.umd.js"></script>
<script nomodule src="js/main-for-legacy.js"></script>
```

To run module-enabled scripts locally, you'll need a simple local server setup like [this](https://www.npmjs.com/package/http-server) (test the demo locally by running `npm run serve`) because otherwise you may see a CORS error when your browser tries to load the script as a module.

### For Webpack and other build systems
Import from the package, instead of the file location:

```js
import { CountUp } from 'countup.js';
```

### UMD module

CountUp is also wrapped as a UMD module in `./dist/countUp.umd.js` and it exposes CountUp as a global variable on the window scope. To use it, include `countUp.umd.js` in a script tag, and invoke it like so:

```js
var numAnim = new countUp.CountUp('myTarget', 2000);
numAnim.start()
```

---

## Contributing

Before you make a pull request, please be sure to follow these instructions:

1. Do your work on `src/countUp.ts`
1. Lint: `npm run lint`
1. Run tests: `npm t`
1. Build and serve the demo by running `npm start` then check the demo to make sure it counts.

<!-- PUBLISHING

1. bump version in package.json and countUp.ts
2. npm run build
3. commit changes
4. npm publish

-->

---

## Creating Animation Plugins

CountUp supports plugins as of v2.6.0. Plugins implement their own render method to display each frame's formatted value. A class instance or object can be passed to the `plugin` property of CountUpOptions, and the plugin's render method will be called instead of CountUp's.

```ts
export declare interface CountUpPlugin {
  render(elem: HTMLElement, formatted: string): void;
}
```

An example of a plugin:
```ts
export class SomePlugin implements CountUpPlugin {
  // ...some properties here

  constructor(options: SomePluginOptions) {
    // ...setup code here if you need it
  }

  render(elem: HTMLElement, formatted: string): void {
    // render DOM here
  }
}
```
