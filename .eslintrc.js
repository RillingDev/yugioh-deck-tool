module.exports = {
    root: true,
    env: {
        "shared-node-browser": true,
    },
    rules: {
        "no-shadow": "error",
        "no-undef-init": "error",
        "no-import-assign": "error",
        "no-template-curly-in-string": "warn",
        "array-callback-return": "warn",
        "consistent-return": "warn",
        "no-implicit-coercion": "warn",
        "no-dupe-else-if": "warn",
        radix: "warn",

        "prettier/prettier": "warn",

        "import/no-unresolved": "off", // Covered by TS
        "import/named": "off", // Covered by TS
        "import/namespace": "off", // Covered by TS
        "import/no-absolute-path": "error",
        "import/no-self-import": "error",
        "import/no-default-export": "warn",
        "import/no-webpack-loader-syntax": "warn",
        "import/no-useless-path-segments": "warn",
        "import/no-mutable-exports": "warn",

        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-implied-eval": "error",
        "@typescript-eslint/no-explicit-any": "warn",
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
        "@typescript-eslint/no-base-to-string": "warn",
        "@typescript-eslint/no-extra-non-null-assertion": "warn",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
        "@typescript-eslint/no-unnecessary-condition": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
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
