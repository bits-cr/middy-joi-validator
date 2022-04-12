/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '__tests__/mocks'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '__tests__/mocks'],
};