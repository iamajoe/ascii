module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testRegex: 'src.*.spec.ts',
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: false,
  collectCoverageFrom: ['./src/**'],
  bail: 1,
  // reporters: [
  //   [
  //     'jest-slow-test-reporter',
  //     { numTests: 8, warnOnSlowerThan: 300, color: true },
  //   ],
  // ],
};
