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
    coveragePathIgnorePatterns: [
      '/node_modules/',
      'controllers/emailService.js',
      'controllers/imageController.js',
      'controllers/socketController.js',
      'controllers/userController.js',
      'models/imageModel.js',
      'models/userModel.js',
      'routes/azure.js',
      'routes/data.js',
      'routes/images.js',
      'routes/user.js',
    ],
    silent: true,
    verbose: true,
    maxWorkers: 1,
    coverageReporters: ['json', 'lcov', 'text', 'clover']
  };