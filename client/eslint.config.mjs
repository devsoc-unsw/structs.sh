import path from 'node:path';

import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { configs } from 'eslint-config-airbnb-extended/legacy';
import { rules as prettierConfigRules } from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const gitignorePath = path.resolve('.', '.gitignore');

const jsConfig = defineConfig([
  // ESLint recommended config
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
]);

const reactConfig = defineConfig([
  // Airbnb React recommended config
  ...configs.react.recommended,
  // Airbnb React hooks config
  ...configs.react.hooks,
]);

const typescriptConfig = defineConfig([
  // Airbnb React TypeScript config
  ...configs.react.typescript,
]);

const prettierConfig = defineConfig([
  // Prettier plugin
  {
    name: 'prettier/plugin/config',
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // Prettier config
  {
    name: 'prettier/config',
    rules: {
      ...prettierConfigRules,
      'prettier/prettier': 'error',
    },
  },
]);

const overrideConfig = defineConfig([
  {
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        // project: ["tsconfig.json"],
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/prop-types": "error",
      "no-underscore-dangle": "off",

      "no-param-reassign": ["error", {
        props: false,
      }],

      "react/function-component-definition": [2, {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      }],

      "no-console": "off",
      "no-alert": "off",
      "no-nested-ternary": "off",
      "import/prefer-default-export": "off",
      "react/require-default-props": "off",
      "react/no-array-index-key": "off",
      "react/jsx-props-no-spreading": "off",

      "react/no-unstable-nested-components": ["error", {
        allowAsProps: true,
      }],

      "react/react-in-jsx-scope": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "class-methods-use-this": "off",
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      }],

      "no-plusplus": "off",

      "prettier/prettier": ["error", {
        endOfLine: "auto",
      }],
    },
  }
])

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  ...jsConfig,
  ...reactConfig,
  ...typescriptConfig,
  ...prettierConfig,
  ...overrideConfig,
]);
