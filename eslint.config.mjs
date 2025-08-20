//@ts-check
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginCypress from "eslint-plugin-cypress";

export default defineConfig([
	{
		ignores: ["node_modules/", "dist/", "/build/", "eslint.config.mjs"],
	},
	js.configs.all,
	tseslint.configs.all,
	pluginReact.configs.flat.recommended,
	reactHooks.configs["recommended-latest"],
	jsxA11y.flatConfigs.recommended,
	eslintPluginPrettierRecommended,
	reactRefresh.configs.vite,
	pluginCypress.configs.recommended,
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			ecmaVersion: "latest",
			globals: { ...globals.browser, ...globals.node, ...globals.jest },
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
		// REACT
		plugins: {
			react: pluginReact,
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			// React
			"react/react-in-jsx-scope": "off",
			"react-hooks/exhaustive-deps": "error",
			"react/display-name": "off",

			// Eslint-Typescript
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "warn",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			// ПРАВИЛО НА public private protected
			"@typescript-eslint/parameter-properties": "off",
			"@typescript-eslint/explicit-member-accessibility": "off",

			// "@typescript-eslint/member-ordering": "error",
			// "@typescript-eslint/adjacent-overload-signatures": "error",
			// "@typescript-eslint/no-extraneous": "off",
			// ХОИСТИНГ
			"@typescript-eslint/no-use-before-define": "off",

			// МУСОРНЫЕ ПРАВИЛА
			"@typescript-eslint/no-confusing-void-expression": "off",
			"@typescript-eslint/prefer-readonly-parameter-types": "off",
			"@typescript-eslint/restrict-template-expressions": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/strict-boolean-expressions": "off",
			"@typescript-eslint/naming-convention": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/class-methods-use-this": "off",
			"@typescript-eslint/no-extraneous-class": "off",

			// Eslint
			"capitalized-comments": "off",
			"sort-imports": "off",
			"sort-keys": "off",
			radix: "off",
			"no-void": "off",
			"new-cap": "off",
			"one-var": "off",
			"no-console": "off",
			"no-magic-numbers": "off",
			"max-classes-per-file": "off",
			"class-methods-use-this": "off",
			"no-use-before-define": "off",
			"func-style": "off",
			"max-lines-per-function": "off",
			"max-statements": "off",

			"no-warning-comments": "off",
			// "no-warning-comments": [
			// 	"warn",
			// 	{ terms: ["TODO", "FIXME"], location: "start" },
			// ],
		},
	},
]);

// СТАРЫЕ ПРАВИЛА
// eqeqeq: "error",
// "no-var": "error",
// "no-constructor-return": "error",
// "no-duplicate-imports": "error",
// "no-inner-declarations": "error",
// "no-promise-executor-return": "error",
// "no-self-compare": "error",
// "no-template-curly-in-string": "error",
// "no-unassigned-vars": "error",
// "no-unmodified-loop-condition": "error",
// "no-unreachable-loop": "error",
// "no-useless-assignment": "error",
// "require-atomic-updates": "error",
// // camelcase: "error",
// complexity: "error",
// "default-case": "error",
// "default-case-last": "error",
// "func-names": "error",
// "no-array-constructor": "error",
// "no-empty-function": "error",
// "no-eq-null": "error",
// "no-eval": "error",
// "no-extend-native": "error",
// "no-extra-bind": "error",
// "no-implied-eval": "error",
// "no-invalid-this": "error",
// "no-iterator": "error",
// "no-lone-blocks": "error",
// "no-loop-func": "error",
// "no-multi-assign": "error",
// "no-new": "error",
// "no-new-func": "error",
// "no-new-wrappers": "error",
// "no-object-constructor": "error",
// "no-param-reassign": "error",
// "no-proto": "error",
// "no-restricted-exports": "error",
// "no-restricted-globals": "error",
// "no-return-assign": "error",
// "no-script-url": "error",
// "no-sequences": "error",
// "no-shadow": "error",
// "no-throw-literal": "error",
// "no-unused-expressions": "error",
// "no-useless-call": "error",
// "no-useless-computed-key": "error",
// "no-useless-constructor": "error",
// "no-useless-rename": "error",
// "no-useless-return": "error",
// "object-shorthand": "error",
// "prefer-const": "error",
// "prefer-named-capture-group": "error",
// "symbol-description": "error",
// "require-unicode-regexp": "error",
// "require-await": "error",
// "prefer-rest-params": "error",
// "prefer-regex-literals": "error",
// "prefer-promise-reject-errors": "error",
// "prefer-object-has-own": "error",
