const merge = require('merge')

const tsJest = require('ts-jest/jest-preset')
const jestMongoDb = require('@shelf/jest-mongodb/jest-preset')

// https://stackoverflow.com/questions/51002460/is-it-possible-to-use-jest-with-multiple-presets-at-the-same-time
module.exports = merge.recursive(tsJest, jestMongoDb, {
  // Custom Jest config here
  watchPathIgnorePatterns: ['globalConfig']
})
