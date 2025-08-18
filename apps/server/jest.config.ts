import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: "src",
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	collectCoverageFrom: ["**/*.(t|j)s"],
	coverageDirectory: "../coverage",
	testEnvironment: "node",

	moduleNameMapper: {
		"^@libs/types/(.*)$": "<rootDir>/../../../libs/types/src/$1",
		"^@libs/shared/(.*)$": "<rootDir>/../../../libs/shared/src/$1",
		"^@apps/server/(.*)$": "<rootDir>/$1",
	},
};

export default config;
