"use strict";

import Vue from "vue/dist/vue.js";
import appData from "./appData";
import appMethods from "./appMethods";

document.addEventListener("DOMContentLoaded", () => {
    const priceApp = new Vue({
        el: "#app",
        data: appData,
        methods: appMethods
    });

    priceApp.apiLoadNames();

    if (location.search) {
        priceApp.deckLoadUri(location.search);
    }
});
