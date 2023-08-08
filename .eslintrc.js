module.exports = {
  root: true,
  env: { browser: true, es6: true, node: true },
  settings: { react: { version: 'detect' } },
  globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2018, sourceType: 'module' },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/recommended',
    'plugin:security/recommended',
  ],
  plugins: [
    'react',
    'prettier',
    '@typescript-eslint',
    'import',
    'react-hooks',
    'formatjs',
    'security',
    '@sberauto',
  ],
  rules: {
    curly: ['error'],
    radix: ['error'],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-multi-spaces': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'eol-last': ['error', 'always'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': ['warn'],
    'arrow-body-style': ['warn', 'as-needed'],
    'no-unused-vars': ['off'],
    'no-empty-pattern': ['warn'],
    'import/newline-after-import': ['warn'],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': ['warn'],
    'react/self-closing-comp': ['warn'],
    'newline-before-return': ['warn'],
    'security/detect-object-injection': ['off'],
    'security/detect-non-literal-fs-filename': ['off'],
    'react/prop-types': ['off'],
    'react/display-name': ['off'],
    'no-case-declarations': ['off'],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-curly-brace-presence': ['warn'],
    'no-mixed-spaces-and-tabs': ['error'],
    'prettier/prettier': ['error'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'max-len': [
      'error',
      {
        code: 110,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreTrailingComments: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
      },
    ],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          { pattern: 'config', group: 'internal' },
          { pattern: 'assets/**', group: 'internal' },
          { pattern: 'app/**', group: 'internal' },
          { pattern: 'pages/**', group: 'internal' },
          { pattern: 'common/**', group: 'internal' },
          { pattern: 'features/**', group: 'internal' },
          { pattern: 'entities/**', group: 'internal' },
          { pattern: 'store/**', group: 'internal' },
          { pattern: 'shared/**', group: 'internal' },
          { pattern: 'tests/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        name: '@mui/icons-material',
        message: 'Please use "import foo from \'@mui/icons-material/foo\'" instead.',
      },
      {
        name: 'lodash',
        message: 'Please use "import foo from \'lodash/foo\'" instead.',
      },
      {
        name: '@mui/*/*/*',
        message: 'Please don`t use deep import for @mui/*/*/*.',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn'],
        '@sberauto/imports-from-index-only': ['warn'],
      },
    },
  ],
}
