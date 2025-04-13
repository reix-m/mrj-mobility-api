import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '.*.spec.ts$',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  rootDir: '.',
  collectCoverageFrom: ['src/**/*.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  setupFiles: ['./test/expose-env.ts'],
};

export default config;
