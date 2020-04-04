module.exports = {
    root: true,
    env: {
        "es6": true,
        "es2017": true,
        "es2020": true,
        "shared-node-browser": true,
    },
    rules: {
        "no-shadow": "error",
        "no-undef-init": "error",
        "no-import-assign": "error",
        "no-template-curly-in-string": "warn",
        "array-callback-return": "warn",
        "consistent-return": "warn",
        "no-else-return": "warn",
        "no-implicit-coercion": "warn",
        "no-dupe-else-if": "warn",
        "radix": "warn",

        "prettier/prettier": "warn",

        "import/no-unresolved": "off", // Covered by TS
        "import/named": "off", // Covered by TS
        "import/namespace": "off", // Covered by TS
        "import/no-absolute-path": "error",
        "import/no-self-import": "error",
        "import/no-default-export": "warn",
        "import/no-webpack-loader-syntax": "warn",
        "import/no-cycle": "warn",
        "import/no-useless-path-segments": "warn",
        "import/no-mutable-exports": "warn",

        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-base-to-string": "error",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-implied-eval": "error",
        "@typescript-eslint/interface-name-prefix": [
            "warn",
            {
                prefixWithI: "never",
            },
        ],
        "@typescript-eslint/no-extra-non-null-assertion": "warn",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
        "@typescript-eslint/no-unnecessary-condition": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/prefer-readonly": "warn"
    },
};
