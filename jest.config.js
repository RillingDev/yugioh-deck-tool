module.exports = {
	projects: [
		{
			displayName: "browser",
			preset: "@vue/cli-plugin-unit-jest/presets/typescript",
			testMatch: [
				"<rootDir>/tests/unit/browser-common/**/*",
				"<rootDir>/tests/unit/tooltip/**/*",
				"<rootDir>/tests/unit/application/**/*",
			],
		},
		{
			displayName: "node",
			preset: "ts-jest",
			testEnvironment: "node",
			transformIgnorePatterns: ["/node_modules/"],
			// support the same @ -> src alias mapping in source code
			moduleNameMapper: {
				"^@/(.*)$": "<rootDir>/src/$1",
			},
			testMatch: [
				"<rootDir>/tests/unit/core/**/*",
				"<rootDir>/tests/unit/ygoprodeck/**/*",
			],
		},
	],
};
