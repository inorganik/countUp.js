import terser from '@rollup/plugin-terser';
/**
 * Regarding "(!) `this` has been rewritten to `undefined`" warning:
 * It occurs because of typescript's Object.assign polyfill, which uses
 * `this` on the global scope. If you set `context: 'window'` in the rollup
 * config, it will silence the warning, but it will cause issues if CountUp
 * is not run in the browser. Allowing rollup to rewrite this to undefined
 * on just the global scope is harmless and doesn't break anything.
 */
export default [
  // minified build
  {
    input: 'dist/countUp.js',
    output: {
      file: 'dist/countUp.min.js',
    },
    plugins: [
      terser(), // minify the output
    ],
  },
  // UMD build
  {
    input: 'dist/countUp.js',
    output: {
      file: 'dist/countUp.umd.js',
      name: 'countUp',
      format: 'umd',
    },
    plugins: [
      terser(),
    ],
  }
];
