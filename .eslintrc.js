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
        "prettier/prettier": "warn",
        "@typescript-eslint/interface-name-prefix": [
            "warn",
            {
                "prefixWithI": "never"
            }
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off"
    }
};
