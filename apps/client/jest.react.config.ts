import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	moduleFileExtensions: ["js", "json", "ts", "jsx", "tsx"],
	rootDir: "src",
	testRegex: ".*\\.spec\\.tsx$",
	transform: {
		"^.+\\.(t|j)sx$": "ts-jest",
	},
	collectCoverageFrom: ["**/*.(t|j)sx"],
	coverageDirectory: "../coverage",
	testEnvironment: "jsdom",

	moduleNameMapper: {
		"^@libs/types/(.*)$": "<rootDir>/../../../libs/types/src/$1",
		"^@libs/shared/(.*)$": "<rootDir>/../../../libs/shared/src/$1",
		"^@apps/client/(.*)$": "<rootDir>/$1",
	},
};

export default config;
