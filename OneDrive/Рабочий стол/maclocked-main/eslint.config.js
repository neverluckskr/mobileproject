import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        Notification: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-console': 'off',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'never',
        },
      ],
    },
  },
  {
    files: ['src/service-worker.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.js', 'tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
      },
    },
  },
  prettier,
];
