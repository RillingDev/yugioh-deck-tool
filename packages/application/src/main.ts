import "reflect-metadata";
import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import store from "./store/store";
import "./styles/main.scss";

Vue.use(VueCompositionApi);

new Vue({
    store,
    render: (h) => h(App),
}).$mount("#deckToolApplication");
