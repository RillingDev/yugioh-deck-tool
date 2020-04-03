import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import logger, { levels } from "loglevel";

logger.setLevel(
    process?.env?.NODE_ENV === "development" ? levels.DEBUG : levels.WARN
);

new Vue({
    render: (h) => h(App),
}).$mount("#decktoolApp");
