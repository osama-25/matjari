module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/__tests__/**/*.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'controllers/**/*.js',
      'models/**/*.js',
      'routes/**/*.js',
      
    ],
    silent: true,
    verbose: true,
    maxWorkers: 1,
    coverageReporters: ['json', 'lcov', 'text', 'clover']
  };