export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/', '/dist'],
    clearMocks: true,
    restoreMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'features/**/*.ts',
        'utils/**/*.ts',
        '!**/*Repository.ts',
    ],
};
