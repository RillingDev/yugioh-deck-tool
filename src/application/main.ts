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

createApp(App)
	.use(createPinia())
	.use(
		createVuetify({
			icons: {
				defaultSet: "fa",
				aliases,
				sets: {
					fa,
				},
			},
		}),
	)
	.mount("#deckToolApplication")
	.$nextTick(() => {
		window.yugiohDeckToolApplication = useBridge();
	});
