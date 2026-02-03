const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    collectCoverage: true, // Enable coverage collection
    collectCoverageFrom: [
        "app/**/*.{js,jsx,ts,tsx}", // Include all JS/TS files inside src/
        "!src/index.tsx", // Exclude entry point
        "!src/reportWebVitals.ts", // Exclude unnecessary files
        "!src/setupTests.ts"
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
}

module.exports = createJestConfig(customJestConfig)