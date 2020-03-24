module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['jest'],
  extends: [
    '@react-native-community',
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  env: {
    'jest/globals': true,
  },
  rules: {
    '@typescript-eslint/no-use-before-define': 0,
    'import/prefer-default-export': 0,
    'no-restricted-syntax': 0,
  },
};
