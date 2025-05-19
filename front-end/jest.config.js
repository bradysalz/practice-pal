const { createDefaultPreset } = require('ts-jest');

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
