import "reflect-metadata";
import Vue from "vue";
import App from "./App.vue";
import logger, { levels } from "loglevel";
import { DEVELOPMENT_MODE } from "../../core/src/main";

logger.setLevel(DEVELOPMENT_MODE ? levels.DEBUG : levels.WARN);

new Vue({
    render: (h) => h(App),
}).$mount("#decktoolApp");
