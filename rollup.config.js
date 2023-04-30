import { terser } from 'rollup-plugin-terser';

export default [
  // minified build
  {
    input: 'dist/countUp.js',
    output: {
      file: 'dist/countUp.min.js',
    },
    context: 'window',
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
    context: 'window',
    plugins: [
      terser(),
    ],
  }
];
