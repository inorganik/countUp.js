module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testRegex: '(\\.|/)(test|spec)\\.ts?$',
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'ts',
    'js',
    'jsx',
    'json',
    'node'
  ]
}
