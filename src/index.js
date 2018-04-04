import Vue from "vue/dist/vue.runtime.esm";
import index from "./containers/index.vue";

const app = new Vue({
    el: "#decktoolApp",
    render: fn => fn(index)
});

export default app;
