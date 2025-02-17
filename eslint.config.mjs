import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const rules = pluginJs.configs.recommended.rules;

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["src/**/*.{js,mjs,cjs,ts}"]},
  {files: ["src/**/*.js"], languageOptions: {sourceType: "script"}},
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
  {rules: {"@typescript-eslint/no-unused-vars": [
    "error",
    {varsIgnorePattern: "^_", argsIgnorePattern: "^_"}
  ]}},
];