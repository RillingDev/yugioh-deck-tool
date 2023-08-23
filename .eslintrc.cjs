/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	root: true,
	extends: [
		"plugin:vue/recommended",
		"eslint:recommended",
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting'
	],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		/*
		 * ESLint
		 */
		// Error prevention
		"array-callback-return": "warn",
		"consistent-return": "warn",
		"no-constructor-return": "warn",
		"no-implicit-coercion": "warn",
		"no-promise-executor-return": "error",
		"no-template-curly-in-string": "warn",
		"no-undef-init": "error",
		"no-unreachable-loop": "warn",
		"require-atomic-updates": "warn",
		radix: "warn",

		/*
		 * Typescript
		 */
		"@typescript-eslint/consistent-type-imports": "warn",
		"@typescript-eslint/explicit-function-return-type": [
			"warn",
			{
				allowExpressions: true,
			},
		],
		"@typescript-eslint/member-delimiter-style": "warn",
		"@typescript-eslint/method-signature-style": "warn",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/prefer-function-type": "warn",
	},
};
