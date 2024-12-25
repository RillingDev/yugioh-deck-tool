import "vuetify/styles";
import "./assets/main.scss";

import { createPinia } from "pinia";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";
import type { ApplicationApi } from "./api";
import App from "./App.vue";
import { useBridge } from "./bridge";

declare global {
	interface Window {
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
		window.yugiohDeckToolApplication = useBridge();
	});
