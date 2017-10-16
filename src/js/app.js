"use strict";

import Vue from "vue/dist/vue.esm.js";

import dataPriceCurrencies from "./data/priceCurrencies";
import dataPriceModes from "./data/priceModes";
import dataDeckParts from "./data/deckParts";

import uriLocationNoParam from "./methods/uriLocationNoParam";
import apiLoadNames from "./methods/apiLoadNames";
import apiLoadPrices from "./methods/apiLoadPrices";
import deckLoad from "./methods/deckLoad";
import deckLoadUri from "./methods/deckLoadUri";
import deckUpdate from "./methods/deckUpdate";
import deckCardsWithoutPriceData from "./methods/deckCardsWithoutPriceData";
import priceConvert from "./methods/priceConvert";
import priceForCard from "./methods/priceForCard";
import priceForSection from "./methods/priceForSection";
import builderUpdateNames from "./methods/builderUpdateNames";
import builderDeckAdd from "./methods/builderDeckAdd";
import builderDeckRemove from "./methods/builderDeckRemove";
import fileDownloadDeck from "./methods/fileDownloadDeck";
import fileOnUpload from "./methods/fileOnUpload";
import shareText from "./methods/shareText";

//ready-event required because ygoprodeck.com loads scripts in head
document.addEventListener("DOMContentLoaded", () => {
    const urlQuery = location.search;
    const priceApp = new Vue({
        el: "#app",
        data: {
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
        },
        methods: {
            uriLocationNoParam,

            apiLoadNames,
            apiLoadPrices,

            deckLoad,
            deckLoadUri,
            deckUpdate,
            deckCardsWithoutPriceData,

            priceConvert,
            priceForCard,
            priceForSection,

            builderUpdateNames,
            builderDeckAdd,
            builderDeckRemove,

            fileDownloadDeck,
            fileOnUpload,

            shareText
        }
    });

    priceApp.apiLoadNames();

    if (urlQuery.indexOf("?d") !== -1) {
        priceApp.deckLoadUri(urlQuery);
    }
});
