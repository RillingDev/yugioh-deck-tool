"use strict";

import dataPriceCurrencies from "./data/priceCurrencies";
import dataPriceModes from "./data/priceModes";
import dataDeckParts from "./data/deckParts";

const appData = {
    deckparts: dataDeckParts,
    deck: {
        name: "Unnamed",
        link: "",
        list: {
            main: [],
            extra: [],
            side: []
        }
    },
    cards: {
        pairs: [],
        data: {}
    },
    builder: {
        filter: "",
        pairsFiltered: [],
    },
    price: {
        activeCurrency: "dollar_us",
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