import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist", "docs", "**/routeTree.gen.ts"] },
  js.configs.recommended,
  {
    files: ["scripts/**"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    settings: {
      react: { version: "19.2" },
    },
    rules: {
      ...reactRefresh.configs.recommended.rules,
      "no-console": "warn",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      "no-nested-ternary": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "react/jsx-fragments": ["error", "syntax"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  }
);
