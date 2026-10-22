import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      tailwindcss: tailwind,
      boundaries: boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "admin", pattern: "src/app/admin/*" },
        { type: "manager", pattern: "src/app/manager/*" },
        { type: "trainer", pattern: "src/app/trainer/*" },
        { type: "member", pattern: "src/app/member/*" },
        { type: "superadmin", pattern: "src/app/superadmin/*" }
      ]
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "tailwindcss/no-arbitrary-value": "warn",
      "boundaries/dependencies": [
        2,
        {
          default: "disallow",
          policies: [
            { from: { element: { type: "admin" } }, allow: [{ to: { element: { type: "admin" } } }] },
            { from: { element: { type: "manager" } }, allow: [{ to: { element: { type: "manager" } } }] },
            { from: { element: { type: "trainer" } }, allow: [{ to: { element: { type: "trainer" } } }] },
            { from: { element: { type: "member" } }, allow: [{ to: { element: { type: "member" } } }] },
            { from: { element: { type: "superadmin" } }, allow: [{ to: { element: { type: "superadmin" } } }] }
          ]
        }
      ]
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
