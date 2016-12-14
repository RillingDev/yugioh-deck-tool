"use strict";

import dataPriceCurrencies from "./data/priceCurrencies";
import dataPriceModes from "./data/priceModes";
import dataDeckParts from "./data/deckParts";

const appData = {
    deckparts: dataDeckParts,
    deck: {
        link: "",
        list: {}
    },
    cards: {
        unique: [],
        data: {}
    },
    price: {
        activeMode: "dollar_us",
        modes: dataPriceModes,
        currencies: dataPriceCurrencies
    },
    ajax: {
        currentlyLoading: false,
        namesLoaded: false,
        pricesLoaded: false
    }
};

export default appData;
