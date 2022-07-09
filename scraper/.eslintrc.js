module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  exclude: ['node_modules', 'dist'],
  plugins: ['@typescript-eslint'],
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    quotes: 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'no-useless-constructor': 'off',
  },
};
