module.exports = {
    extends: [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint",
        "../.eslintrc.js",
    ],
    env: {
        "browser": true,
        "node": true
    }
};
