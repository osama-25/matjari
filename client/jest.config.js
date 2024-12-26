const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/app/components/$1',
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
     "app/[locale]/add_listing/**/*.{js,jsx,ts,tsx}",
     "app/[locale]/edit_listing/**/*.{js,jsx,ts,tsx}",
     "app/[locale]/search/**/*.{js,jsx,ts,tsx}",
     "app/[locale]/global_components/loading/**/*.{js,jsx,ts,tsx}",
     "app/[locale]/home/NavBar.js"
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    '.next',
    'test-utils',
    'jest.setup.js',
    'jest.config.js'
  ],
  silent: true,
  verbose: true,
  maxWorkers: 1,
  coverageReporters: ['text', 'lcov', 'html', 'text-summary'],
  testEnvironmentOptions: {
    showConsole: false
  }
};

module.exports = createJestConfig(customJestConfig);