import "reflect-metadata";
import Vue from "vue";
import { bindApplicationApi } from "./api";
import App from "./App.vue";
import { store } from "./store/store";
import "./styles/main.scss";
import { ToastPlugin, VBModalPlugin, VBTogglePlugin } from "bootstrap-vue";

Vue.config.productionTip = false;

Vue.use(ToastPlugin);
Vue.use(VBModalPlugin);
Vue.use(VBTogglePlugin);

new Vue({
	store,
	render: (h) => h(App),
})
	.$mount("#deckToolApplication")
	.$nextTick(() => bindApplicationApi());
