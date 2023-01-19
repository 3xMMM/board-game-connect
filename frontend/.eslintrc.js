module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "react-app",
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    'react',
  ],
  rules: {
    "semi": ["error", "always"],
    "@typescript-eslint/semi": ["error", "always"],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
    }],
    "@typescript-eslint/comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
    }],
    "@typescript-eslint/strict-boolean-expressions": "off",
  },
};
