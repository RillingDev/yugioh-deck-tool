module.exports = {
    root: true,
    rules: {
        /*
         * ESLint
         */
        // Error prevention
        "no-shadow": "error",
        "no-undef-init": "error",
        "no-import-assign": "error",
        "no-loss-of-precision": "error",
        "no-promise-executor-return": "error",
        "no-template-curly-in-string": "warn",
        "no-implicit-coercion": "warn",
        radix: "warn",
        "array-callback-return": "warn",
        "consistent-return": "warn",
        "no-dupe-else-if": "warn",
        "no-unreachable-loop": "warn",

        /*
         * Prettier
         */
        "prettier/prettier": "warn",

        /*
         * Imports
         */
        // Error prevention
        "import/no-mutable-exports": "warn",
        "import/no-self-import": "error",
        "import/no-absolute-path": "error",
        "import/no-webpack-loader-syntax": "warn",
        "import/no-unresolved": "off", // Covered by TS
        "import/named": "off", // Covered by TS
        "import/namespace": "off", // Covered by TS

        // Styleguide
        "import/no-default-export": "warn",
        "import/no-useless-path-segments": "warn",

        /*
         * Typescript
         */
        // Error prevention
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-implied-eval": "error",
        "@typescript-eslint/no-base-to-string": "error",
        "@typescript-eslint/strict-boolean-expressions": "error",

        // Confusion prevention
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/no-confusing-non-null-assertion": "warn",
        "@typescript-eslint/no-extra-non-null-assertion": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/prefer-includes": "warn",
        "@typescript-eslint/require-array-sort-compare": "warn",
        "@typescript-eslint/prefer-regexp-exec": "warn",

        // Styleguide
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/prefer-function-type": "warn",
        "@typescript-eslint/member-delimiter-style": "warn",
        "@typescript-eslint/method-signature-style": "warn",
        "@typescript-eslint/consistent-type-assertions": [
            "warn",
            {
                assertionStyle: "as",
            },
        ],
        "@typescript-eslint/explicit-function-return-type": [
            "warn",
            {
                allowExpressions: true,
            },
        ],
        "@typescript-eslint/ban-types": [
            "warn",
            {
                types: {
                    object: false,
                },
            },
        ],
        "@typescript-eslint/naming-convention": [
            "warn",
            {
                selector: "default",
                format: ["strictCamelCase"],
                leadingUnderscore: "forbid",
                trailingUnderscore: "forbid",
            },
            {
                selector: "variable",
                format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
            },
            {
                selector: "property",
                format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
            },
            { selector: "typeAlias", format: ["StrictPascalCase"] },
            {
                selector: "typeParameter",
                format: ["PascalCase"], // Allow "T", "TValue", "Value" and such
            },
            {
                selector: "interface",
                format: ["StrictPascalCase"],
                custom: {
                    regex: "^I[A-Z]",
                    match: false,
                },
            },
            { selector: "class", format: ["StrictPascalCase"] },
            { selector: "enum", format: ["StrictPascalCase"] },
            { selector: "enumMember", format: ["UPPER_CASE"] },
        ],
    },
};
