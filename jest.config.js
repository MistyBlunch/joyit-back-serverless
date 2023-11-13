module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ["node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
}