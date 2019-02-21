# CountUp.js
CountUp.js is a dependency-free, lightweight Javascript class that can be used to quickly create animations that display numerical data in a more interesting way.

Despite its name, CountUp can count in either direction, depending on the start value and end value that you pass.

CountUp.js supports all browsers. MIT license.

## [Try the demo](http://inorganik.github.io/countUp.js)

## New in 2.0.0

- Completely rewritten in **Typescript**! The distributed code is still Javascript.
- **New** cleaner [method signature](#example).
- Tests with **Jest**. As much code coverage as possible mocking requestAnimationFrame.
- **Smart easing**: CountUp intelligently defers easing until it gets close enough to the end value for easing to be visually noticeable. Configureable in the [options](#options).
- **Separate bundles** for with and without the requestAnimationFrame polyfill. Choose `countUp.min.js` for modern browsers or `countUp.withPolyfill.min.js` for IE9 and older, and Opera mini.

## See Also

- **[CountUp.js Angular ^2 Module](https://github.com/inorganik/countUp.js-angular2)**
- **[CountUp.js Angular 1.x Module](https://github.com/inorganik/countUp.js-angular1)**
- **[CountUp.js React](https://github.com/glennreyes/react-countup)**
- **[CountUp.js Vue component wrapper](https://github.com/xlsdg/vue-countup-v2)**
- **[CountUp.js WordPress Plugin](https://wordpress.org/plugins/countup-js/)**
- **[CountUp.js jQuery Plugin](https://gist.github.com/inorganik/b63dbe5b3810ff2c0175aee4670a4732)**

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

## Contributing <a name="contributing"></a>

Before you make a pull request, please be sure to follow these instructions:

1. Do your work on `src/countUp.ts`
1. Test your work. Do manual tests on the demo in the browser and run `npm t`
1. Run `npm run build`, which copies and minifies the .js files to the `dist` folder.
