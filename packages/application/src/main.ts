import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";

new Vue({
    store,
    render: (h) => h(App),
}).$mount("#decktoolApp");
