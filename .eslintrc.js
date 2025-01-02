module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'react-hooks'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'global-require': 'off',
        'no-empty-function': 'off',
        'no-unused-vars': 'off',
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        'consistent-return': 'off',
        'no-nested-ternary': 'off',
        'no-param-reassign': 'off',
        'array-callback-return': 'off',
        'react/destructuring-assignment': 'off',
        'react/require-default-props': 'off',
        'react/no-unused-prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-console': 'off',
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 'off',
        'no-unused-expressions': [
          'error',
          {
            allowTaggedTemplates: true,
          },
        ],
        'react/jsx-filename-extension': [
          1,
          {
            extensions: ['.tsx', '.jsx', '.ts'],
          },
        ],
        'no-restricted-syntax': [
          'error',
          'FunctionExpression',
          'WithStatement',
          "BinaryExpression[operator='in']",
        ],
        'max-len': [
          2,
          120,
          4,
          {
            ignoreUrls: true,
          },
        ],
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
            mjs: 'never',
            '': 'never',
          },
        ],
      },
    },
  ],
};
