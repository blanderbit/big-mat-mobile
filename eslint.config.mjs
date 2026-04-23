import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import ts from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
  ...ts.configs.strict,
  prettierConfig,
  reactHooks.configs.flat['recommended-latest'],

  {
    files: ['**/*.{ts,tsx,js,jsx}'],

    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },

    plugins: {
      react,
      'react-native': reactNative,
      'simple-import-sort': simpleImportSort,
    },

    settings: {
      react: { version: 'detect' },
    },

    rules: {
      // RN
      'react-native/no-inline-styles': 'warn',
      'react-native/no-unused-styles': 'error',
      'react-native/no-raw-text': 'error',
      'react-native/no-single-element-style-arrays': 'error',

      // TS
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',

      // JS
      'no-console': 'warn',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1 }],

      // React
      // 'react/self-closing-comp': 'warn',

      'react/jsx-sort-props': [
        'error',
        {
          multiline: 'last',
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
        },
      ],

      // imports
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^react-native$', '^@?\\w', '^[a-z]'],
            ['^@components', '^@screens', '^@navigation'],
            [
              '^@API',
              '^@extra',
              '^@localization',
              '^@hooks',
              '^@stores',
              '^@keychain',
            ],
            ['^@assets'],
            ['^@env'],
            ['^\\.'],
          ],
        },
      ],
    },
  },

  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/coverage/**',
      '**/ios/Pods/**',
      '**/android/**',
    ],
  },
];
