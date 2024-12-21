import "vuetify/styles";
import "./assets/main.css";
import type { ApplicationApi } from "./api";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { useBridge } from "./bridge";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";

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
		VToolbar: {
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
