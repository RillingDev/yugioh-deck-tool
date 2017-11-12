import "babel-polyfill";

import Vue from "vue/dist/vue.runtime.esm";
import index from "./containers/index.vue";

const app = new Vue({
    el: "#appYgodeckprice",
    render: fn => fn(index)
});

export default app;
