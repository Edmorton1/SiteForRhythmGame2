//@ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginCypress from 'eslint-plugin-cypress';
import tanstackEslintPlugin from '@tanstack/eslint-plugin-query';

export default defineConfig([
	{
		ignores: ['node_modules/', 'dist/', '/build/', 'eslint.config.mjs'],
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	reactHooks.configs['recommended-latest'],
	jsxA11y.flatConfigs.recommended,
	eslintPluginPrettierRecommended,
	reactRefresh.configs.vite,
	pluginCypress.configs.recommended,
	...tanstackEslintPlugin.configs['flat/recommended'],
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			globals: { ...globals.browser, ...globals.jest },
			parserOptions: {
				project: './tsconfig.eslint.json',
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// React
			'react/react-in-jsx-scope': 'off',
			'react/display-name': 'off',
			// "react-hooks/exhaustive-deps": "error",

			// "no-warning-comments": [
			// 	"warn",
			// 	{ terms: ["TODO", "FIXME"], location: "start" },
			// ],
		},
	},
]);
