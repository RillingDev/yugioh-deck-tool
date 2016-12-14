"use strict";

import Vue from "vue/dist/vue.js";
import appData from "./appData";
import appMethods from "./appMethods";

const priceApp = new Vue({
    el: "#app",
    data: appData,
    methods: appMethods
});

if (location.search) {
    priceApp.deckLoadUri(location.search);
}
