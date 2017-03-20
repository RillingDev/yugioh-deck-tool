"use strict";

import Vue from "Vue/dist/vue.esm.js";
import appData from "./appData";
import appMethods from "./appMethods";

//ready-event required because ygoprodeck.com loads scripts in head
document.addEventListener("DOMContentLoaded", () => {
    const urlQuery = location.search;
    const priceApp = new Vue({
        el: "#app",
        data: appData,
        methods: appMethods
    });

    priceApp.apiLoadNames();

    if (urlQuery.indexOf("?d") !== -1) {
        priceApp.deckLoadUri(urlQuery);
    }
});
