module.exports = {
    parser: "vue-eslint-parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
    },
    plugins: ["import", "@typescript-eslint", "prettier","vue"],
    extends: [
        "eslint:recommended",
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
        "../.eslintrc.js",
    ],
    env: {
        "browser": true,
        "node": true
    },
    rules: {
        "import/no-default-export": "off" // Causes Issues which vue
    }
};
