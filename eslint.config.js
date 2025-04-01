// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierRecommended
    ],
    processor: angular.processInlineTemplates,
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      prettierRecommended
    ],
    rules: {},
  }
);
