"use strict";

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

const appMethods = {
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

    onFileChange(e) {
        const vm = this;
        const files = e.target.files || e.dataTransfer.files;

        vm.deckLoad(files[0]);
    }
};

export default appMethods;
