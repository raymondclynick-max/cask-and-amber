import nextPlugin from "eslint-plugin-next";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
    ],
  },
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  {
    rules: {
      // allow 'any' for now so build will not fail
      "@typescript-eslint/no-explicit-any": "off",

      // don't block build for unused vars
      "@typescript-eslint/no-unused-vars": "warn",

      // stop nagging about effect deps in client components
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
