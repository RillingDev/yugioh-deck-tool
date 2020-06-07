module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./src/tsconfig.json", "./spec/src/tsconfig.json"],
        ecmaVersion: 2020,
    },
    plugins: ["import", "@typescript-eslint", "prettier"],
    extends: [
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
        "prettier/@typescript-eslint",
        "../../.eslintrc.js",
    ],
    env: {
        jasmine: true,
    },
};
