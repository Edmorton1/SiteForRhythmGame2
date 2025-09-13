import type { Config } from 'jest';

const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testEnvironment: 'node',
	testMatch: ['**/__e2e__/**/*.e2e-spec.ts'],
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
};

export default config;
