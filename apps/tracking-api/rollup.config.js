const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

module.exports = {
  input: 'build/lambda.js',
  output: {
    file: 'dist/lambda.js',
    format: 'cjs',
    sourcemap: true
  },
  external: [
    // AWS Lambda runtime dependencies
    'aws-lambda',
    'aws-sdk'
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
      exportConditions: ['node']
    }),
    commonjs(),
    json()
  ]
};
