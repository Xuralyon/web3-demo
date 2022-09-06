module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  globals: {
    // env
    __DEV__: true,
    // jest variables
    jest: true,
    expect: true,
    describe: true,
    it: true,
  },
  rules: {
    indent: 0,
    'dot-notation': 0,
    'no-console': 0,
    'no-debugger': 0,
    'no-use-before-define': 0,
    'no-plusplus': 0,
    'no-shadow': 0,
    'no-extra-semi': 'off',
    'class-methods-use-this': 1,
    eqeqeq: 2,
    'object-curly-newline': 0,
    semi: [2, 'never'],
    strict: 0,
    'max-len': [
      0,
      {
        code: 100,
      },
    ],
    '@typescript-eslint/no-extra-semi': ['off'],
    '@typescript-eslint/no-shadow': 2,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'react/prop-types': 0,
    'react/jsx-uses-vars': 'warn',
    'react/jsx-uses-react': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
