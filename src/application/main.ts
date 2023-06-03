import Vue from "vue";
import type { ApplicationApi } from "./api";
import App from "./App.vue";
import { createPinia, PiniaVuePlugin } from "pinia";
import "./styles/main.scss";
import { ToastPlugin, VBModalPlugin, VBTogglePlugin } from "bootstrap-vue";
import { useBridge } from "@/application/bridge";

declare global {
	interface Window {
		yugiohDeckToolApplication?: ApplicationApi;
	}
}
Vue.config.productionTip = false;

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.use(ToastPlugin);
Vue.use(VBModalPlugin);
Vue.use(VBTogglePlugin);

new Vue({
	render: (h) => h(App),
	// @ts-ignore FIXME after vue 3 migration
	pinia,
})
	.$mount("#deckToolApplication")
	.$nextTick(() => {
		window.yugiohDeckToolApplication = useBridge();
	});
