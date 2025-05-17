import type { Linter } from "eslint";

const config = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
  ],
  rules: {
    "no-unused-vars": "off", // disable core rule
    "@typescript-eslint/no-unused-vars": [
      "error",
      { vars: "all", args: "after-used", ignoreRestSiblings: false },
    ],
  },
};

export default config;
