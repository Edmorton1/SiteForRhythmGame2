//@ts-check
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
	{
		ignores: ["node_modules/", "dist/", "/build/", "eslint.config.mjs"],
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			ecmaVersion: "latest",
			globals: { ...globals.node, ...globals.jest },
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// "no-warning-comments": [
			// 	"warn",
			// 	{ terms: ["TODO", "FIXME"], location: "start" },
			// ],
		},
	},
]);
