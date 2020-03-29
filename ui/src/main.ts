import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue } from "bootstrap-vue";
import logger, { levels } from "loglevel";

logger.setLevel(
    process?.env?.NODE_ENV === "development" ? levels.DEBUG : levels.WARN
);

Vue.use(BootstrapVue);

new Vue({
    render: (h) => h(App),
}).$mount("#decktoolApp");
