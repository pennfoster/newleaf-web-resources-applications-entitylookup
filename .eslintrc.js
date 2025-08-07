module.exports = {
    "env": { /* list of environments to define available global variables */
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [ /* contains a list of plugins ESLint extends */
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    "parser": "@typescript-eslint/parser", /* use the typescript parser */
    "parserOptions": { /* reference the typescript config for parser options */
        "project": "./tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "prettier"
    ],
    "rules": { /* project-specific rules that aren't already defined in standard plugins we define above */
        "@typescript-eslint/no-explicit-any": "off",
        "prettier/prettier": "error"
    }
}