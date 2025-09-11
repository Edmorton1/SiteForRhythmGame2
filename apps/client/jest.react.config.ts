import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	moduleFileExtensions: ['js', 'json', 'ts', 'jsx', 'tsx'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.tsx$',
	transform: {
		'^.+\\.(t|j)sx$': ['ts-jest', { tsconfig: './tsconfig.app.json' }],
	},
	collectCoverageFrom: ['**/*.(t|j)sx'],
	coverageDirectory: '../coverage',
	testEnvironment: 'jsdom',
};

export default config;
