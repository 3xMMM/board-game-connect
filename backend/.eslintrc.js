module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: "standard-with-typescript",
  parserOptions: {
    ecmaVersion: "latest",
    project: ["./tsconfig.eslint.json"],
  },
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
    "object-curly-spacing": ["error", "always"],
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
  },
};
