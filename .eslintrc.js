module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  env: {
    node: true,
    es2020: true,
  },
  ignorePatterns: ["__tests__/**", "node_modules/**", "dist/**", "types/**", "*.js"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "no-console": "off",
    "consistent-return": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "prefer-const": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    'prettier/prettier': [
      2,
      {
          endOfLine: 'auto',
          printWidth: 150,
          semi: true,
          tabWidth: 4,
          trailingComma: 'all',
      },
    ],
  },
};
