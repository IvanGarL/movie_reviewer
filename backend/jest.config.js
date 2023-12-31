const testMatch = ['**/*.test.ts'];
/* eslint-disable */
module.exports = {
    displayName: 'movire-reviewer-test',
    roots: ['src/', 'node_modules/'],
    globals: {},
    transform: {
        '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    },
    testTimeout: 170000,
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    restoreMocks: true,
    testMatch,
};