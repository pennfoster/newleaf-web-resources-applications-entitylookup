const {
    defineConfig,
} = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
        },

        parser: tsParser,
        "sourceType": "module",

        parserOptions: {
            "project": "./tsconfig.json",
        },
    },

    extends: compat.extends("plugin:@typescript-eslint/recommended", "prettier"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
    },

    "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "prettier/prettier": "error",
        "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]

    },
}]);