import "reflect-metadata";
import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import { bindApplicationApi } from "./api";
import App from "./App.vue";
import { store } from "./store/store";
import "./styles/main.scss";
import { ToastPlugin, VBModalPlugin, VBTogglePlugin } from "bootstrap-vue";

Vue.use(VueCompositionApi);

Vue.use(ToastPlugin);
Vue.use(VBModalPlugin);
Vue.use(VBTogglePlugin);

new Vue({
	store,
	render: (h) => h(App),
})
	.$mount("#deckToolApplication")
	.$nextTick(() => bindApplicationApi());
