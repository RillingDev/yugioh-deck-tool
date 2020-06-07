module.exports = {
    parser: "vue-eslint-parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
        ecmaVersion: 2020,
        sourceType: "module",
    },
    plugins: ["import", "@typescript-eslint", "prettier", "vue"],
    extends: [
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
        "prettier/@typescript-eslint",
        "plugin:vue/essential",
        "@vue/typescript/recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint",
        "../../.eslintrc.js",
    ],
    env: {
        browser: true,
    },
    rules: {
        "import/no-default-export": "off", // Causes Issues with Vue
        "@typescript-eslint/naming-convention": [
            "warn",

            {
                selector: "variable",
                format: ["strictCamelCase", "PascalCase", "UPPER_CASE"], // Many 3rd party components have a non-strict pascal case name
            },
        ],
    },
};
