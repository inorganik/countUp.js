import { terser } from 'rollup-plugin-terser';

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
