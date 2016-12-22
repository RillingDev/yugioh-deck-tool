"use strict";

import dataPriceCurrencies from "./data/priceCurrencies";
import dataPriceModes from "./data/priceModes";
import dataDeckParts from "./data/deckParts";

const appData = {
    deckparts: dataDeckParts,
    deck: {
        link: "",
        unique: [],
        list: {
            main: [],
            extra: [],
            side: []
        }
    },
    cards: {
        names: [],
        data: {},
        mapNameToId: new Map(),
    },
    builder: {
        filter: "Fluffal",
        filteredNames: [],
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
