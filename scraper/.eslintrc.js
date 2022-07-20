module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    semi: 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/semi': ['error', 'always'],
    quotes: 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'no-useless-constructor': 'off',
    'no-fallthrough': ['error', { commentPattern: 'fallthrough' }],
  },
};
