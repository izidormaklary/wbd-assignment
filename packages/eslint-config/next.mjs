import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
  allConfig: {},
});

export default defineConfig([
  // Global ignores
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/coverage/**",
      "**/.*.js",
    ],
  },
  // mimic ESLintRC-style extends
  ...compat.extends("eslint:recommended"),
  ...compat.extends("prettier"),
  ...compat.extends("turbo"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        React: true,
        JSX: true,
      },
      ecmaVersion: "latest",
      sourceType: "module",
      parser: (await import("@typescript-eslint/parser")).default,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "only-warn": (await import("eslint-plugin-only-warn")).default,
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin")).default,
    },
    rules: {
      // Disable the base rule as it can report incorrect errors
      "no-unused-vars": "off",
      // Enable the TypeScript version
      "@typescript-eslint/no-unused-vars": "warn",
      "turbo/no-undeclared-env-vars": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: path.resolve(process.cwd(), "tsconfig.json"),
        },
      },
    },
  },
]);
