import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

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
  {
    plugins: {
      import: importPlugin
    },
    rules: {
      // Import order rules
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",    // Node.js built-in modules
            "external",   // Third-party packages
            "internal",   // Internal packages (configured below)
            ["parent", "sibling"], // Parent and sibling imports
            "index",      // Index imports
            "object",     // Object imports
            "type"        // Type imports
          ],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          },
          "pathGroups": [
            {
              "pattern": "{[A-Za-z]*,@*/**}", // Third-party packages (excluding our % alias)
              "group": "external",
              "position": "before"
            },
            {
              "pattern": "{#/**,./**}", // Project imports with % alias
              "group": "internal",
              "position": "before"
            }
          ],
          "pathGroupsExcludedImportTypes": ["builtin"]
        }
      ]
    }
  }
];