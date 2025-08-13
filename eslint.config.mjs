// eslint.config.js (ESM, compatible with "type": "module")
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// 👇 This is the Windows-safe absolute path
const baseDir = path.resolve(fileURLToPath(import.meta.url), '..');

const compat = new FlatCompat({
    baseDirectory: baseDir,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier'),
    {
        files: ['src/**/*.ts'],
        ignores: ['node_modules/**'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.commonjs,
            },
            parser: tsParser,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    }
]);