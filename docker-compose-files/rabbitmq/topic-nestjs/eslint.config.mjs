// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-named-exports': 'error',
      'perfectionist/sort-enums': 'error',
    },
  },
);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
//   allConfig: js.configs.all,
// });

// export default [
//   {
//     ignores: ['**/.eslintrc.js'],
//   },
//   ...compat.extends(
//     'plugin:@typescript-eslint/recommended',
//     'plugin:prettier/recommended',
//   ),
//   {
//     plugins: {
//       '@typescript-eslint': typescriptEslintEslintPlugin,
//       perfectionist,
//     },

//     languageOptions: {
//       globals: {
//         ...globals.node,
//         ...globals.jest,
//       },

//       parser: tsParser,
//       ecmaVersion: 5,
//       sourceType: 'module',

//       parserOptions: {
//         project: 'tsconfig.json',
//         tsconfigRootDir:
//           '/home/kasir/projects/docker/docker-compose-files/rabbitmq/topic-nestjs',
//       },
//     },

//     rules: {
//       '@typescript-eslint/interface-name-prefix': 'off',
//       '@typescript-eslint/explicit-function-return-type': 'off',
//       '@typescript-eslint/explicit-module-boundary-types': 'off',
//       '@typescript-eslint/no-explicit-any': 'off',
//       'perfectionist/sort-imports': 'error',
//       'perfectionist/sort-named-exports': 'error',
//       'perfectionist/sort-enums': 'error',
//     },
//   },
// ];
