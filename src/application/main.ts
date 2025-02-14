import { useBridge } from "@/application/bridge";
import { environmentConfig } from "@/application/ctx";
import { Environment } from "@/core/EnvironmentConfig";
import type { TooltipInstance } from "@/tooltip/api";
import "@/tooltip/styles/tooltip.scss";
import { bindTooltipHandlers } from "@/tooltip/tooltip/bindTooltip";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";
import "vuetify/styles";
import type { ApplicationApi } from "./api";
import App from "./App.vue";
import "./assets/main.scss";

declare global {
	interface Window {
		yugiohDeckToolTooltip?: TooltipInstance;
		yugiohDeckToolApplication?: ApplicationApi;
	}
}

const pinia = createPinia();

const vuetify = createVuetify({
	icons: {
		defaultSet: "fa",
		aliases,
		sets: {
			fa,
		},
	},
	defaults: {
		VBtn: {
			size: "small",
		},
		VBtnGroup: {
			density: "compact",
		},
		VBtnToggle: {
			density: "compact",
		},
		VTextField: {
			density: "compact",
		},
		VFileInput: {
			density: "compact",
		},
		VTextarea: {
			density: "compact",
		},
		VSelect: {
			density: "compact",
		},
		VCombobox: {
			density: "compact",
		},
		VAlert: {
			density: "compact",
		},
		VMenuItem: {
			density: "compact",
		},
	},
});

createApp(App)
	.use(pinia)
	.use(vuetify)
	.mount("#deckToolApplication")
	.$nextTick(() => {
		if (environmentConfig.getEnvironment() !== Environment.YGOPRODECK) {
			window.yugiohDeckToolTooltip = bindTooltipHandlers(document.body);
		}

		window.yugiohDeckToolApplication = useBridge();
	});
