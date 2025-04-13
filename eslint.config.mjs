/**
 * Inspect ESLint configuration.
 * Command: `npx @eslint/config-inspector@latest`
 */
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';

/**
 * Plugins
 */
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';

/**
 * Typescript eslint
 */
const tsEslintConfig = tsEslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  {
    languageOptions: {
      // Global variables
      // https://eslint.org/docs/latest/use/configure/language-options#specifying-globals
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        projectService: './tsconfig.json',
        // allowDefaultProject: ['*.js', '*.mjs'],
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
);

const importPluginConfig = {
  plugins: {
    import: fixupPluginRules(importPlugin),
  },

  rules: {
    'import/no-unresolved': 0, // Handled by TypeScript compiler
    'import/order': [
      'warn',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': 1,
    'import/no-anonymous-default-export': 1,
  },
};

const config = [
  prettierPlugin,
  importPluginConfig,
  promisePlugin.configs['flat/recommended'],
  ...tsEslintConfig,
];

export default config;
