import "reflect-metadata";
import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import store from "./store/store";
import "./styles/main.scss";
import { ModalPlugin, ToastPlugin, VBModalPlugin } from "bootstrap-vue";

Vue.use(VueCompositionApi);

Vue.use(ToastPlugin);
Vue.use(VBModalPlugin);

new Vue({
    store,
    render: (h) => h(App),
}).$mount("#deckToolApplication");
