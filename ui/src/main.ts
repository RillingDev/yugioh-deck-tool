import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue } from "bootstrap-vue";

Vue.use(BootstrapVue);

new Vue({
    render: h => h(App)
}).$mount("#decktoolApp");
