module.exports = {
    root: true,
    extends: [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint"
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    env: {
        "browser": true,
        "node": true
    },
    rules: {
        "no-console": "warn",
        "no-debugger": "warn",
        "no-unused-vars": "warn",

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

        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-use-before-define": "warn",
        "@typescript-eslint/unbound-method": "off",
    }
};
