import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import {
	defineConfigWithVueTs,
	vueTsConfigs,
} from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
	{
		name: "app/files-to-lint",
		files: ["**/*.{ts,mts,tsx,vue}"],
	},

	{
		name: "app/files-to-ignore",
		ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
	},

	pluginVue.configs["flat/recommended"],
	vueTsConfigs.recommended,
	vueTsConfigs.stylistic,

	{
		...pluginVitest.configs.recommended,
		files: ["src/**/__tests__/*"],
	},
	skipFormatting,
	{
		rules: {
			// Vue: stylistic consistency
			"vue/block-order": [
				"error",
				{
					order: ["template", "script", "style"],
				},
			],
			"vue/component-api-style": "warn",
			"vue/component-name-in-template-casing": "warn",
			"vue/custom-event-name-casing": "warn",
			"vue/define-emits-declaration": "warn",
			"vue/define-macros-order": "warn",
			"vue/define-props-declaration": "warn",
			// Vue: Error prevention
			"vue/no-setup-props-reactivity-loss": "error",
			"vue/no-use-v-else-with-v-for": "warn",
			"vue/no-useless-v-bind": "warn",
		},
	},
);
