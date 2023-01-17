module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./tsconfig.eslint.json']
  },
  rules: {
    semi: [2, 'always'],
    "@typescript-eslint/semi": [2, 'always']
  }
};
