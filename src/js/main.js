"use strict";

import Vue from "vue/dist/vue.js";

import deckRead from "./methods/deckRead";
import deckReadUri from "./methods/deckReadUri";
import uriLocationNoParam from "./methods/uriLocationNoParam";

const priceApp = new Vue({
    el: "#app",
    data: {
        deck: {
            file: "",
            link: "",
            data: {},
            unique: []
        }
    },
    methods: {
        uriLocationNoParam,
        onFileChange(e) {
            const vm = this;
            const files = e.target.files || e.dataTransfer.files;

            vm.deckLoad(files[0]);
        },
        deckLoad(file) {
            const reader = new FileReader();
            const vm = this;

            reader.onload = e => {
                vm.deck = deckRead(e.target.result);
            };
            reader.readAsText(file);
        },
        deckLoadUri(uriDeck) {
            const vm = this;

            vm.deck = deckReadUri(uriDeck);
        }
    }
});

if (location.search) {
    priceApp.deckLoadUri(location.search);
}
