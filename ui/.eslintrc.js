module.exports = {
    root: true,

    env: {
        node: true
    },

    extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],

    parserOptions: {
        parser: '@typescript-eslint/parser'
    },

    rules: {
        "no-console": "warn",
        "no-debugger": "warn",

        "no-shadow": "error",
        "no-undef-init": "error",
        "no-import-assign": "error",
        "no-template-curly-in-string": "warn",
        "array-callback-return": "warn",
        "consistent-return": "warn",
        "no-else-return": "warn",
        "no-implicit-coercion": "warn",
        "no-dupe-else-if": "warn"
    },

    'extends': [
      'plugin:vue/essential',
      'eslint:recommended',
      '@vue/prettier',
      '@vue/typescript'
    ]
};
