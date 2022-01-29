module.exports = {
	parser: "vue-eslint-parser",

	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
	},

	plugins: ["@typescript-eslint", "prettier", "import", "vue"],

	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"prettier",

		"plugin:vue/recommended",
		"@vue/typescript/recommended",
		"@vue/prettier",
		"@vue/prettier/@typescript-eslint",

		"../../.eslintrc.js",
	],

	rules: {
		"import/no-default-export": "off", // Causes Issues with Vue

		// Not all 3rd party libs provide typings.
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",

		"@typescript-eslint/naming-convention": [
			"warn",

			{
				selector: "variable",
				format: ["strictCamelCase", "PascalCase", "UPPER_CASE"], // Many 3rd party components have a non-strict pascal case name
			},
		],
	},

	overrides: [
		{
			files: [
				"**/tests/unit/**/*.spec.{j,t}s?(x)",
			],
			env: {
				jest: true,
			},
		},
	],
};
