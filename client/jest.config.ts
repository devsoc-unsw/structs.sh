import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    roots: ['<rootDir>'],
    verbose: true,
    modulePaths: ['<rootDir>'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    },
    transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)'],
    testRegex: '.*test.tsx$',
    // Part of setting up react-testing-library's Jest matchers: https://github.com/testing-library/jest-dom
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};

export default config;
