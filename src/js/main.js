"use strict";

import Vue from "vue/dist/vue.min.js";
import appData from "./appData";
import appMethods from "./appMethods";

document.addEventListener("DOMContentLoaded", () => {
    const priceApp = new Vue({
        el: "#app",
        data: appData,
        methods: appMethods
    });

    priceApp.apiLoadNames();

    if (location.search.indexOf("?d") !== -1) {
        priceApp.deckLoadUri(location.search);
    }
});
