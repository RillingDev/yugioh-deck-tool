"use strict";

import deckRead from "./methods/deckRead";
import deckReadUri from "./methods/deckReadUri";
import uriLocationNoParam from "./methods/uriLocationNoParam";

const appMethods = {
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
            const deck = deckRead(e.target.result, data => {
                vm.cards.data = data;
            });

            vm.deck.link = deck.link;
            vm.deck.list = deck.list;
            vm.cards.unique = deck.unique;
        };
        reader.readAsText(file);
    },
    deckLoadUri(uriDeck) {
        const vm = this;
        const deck = deckReadUri(uriDeck, data => {
            vm.cards.data = data;
        });

        vm.deck.link = deck.link;
        vm.deck.list = deck.list;
        vm.cards.unique = deck.unique;
    }
};

export default appMethods;
