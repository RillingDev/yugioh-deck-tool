"use strict";

import uriLocationNoParam from "./methods/uriLocationNoParam";
import apiLoadNames from "./methods/apiLoadNames";
import apiLoadPrices from "./methods/apiLoadPrices";
import deckLoad from "./methods/deckLoad";
import deckLoadUri from "./methods/deckLoadUri";
import priceConvert from "./methods/priceConvert";
import priceForCard from "./methods/priceForCard";
import priceForSection from "./methods/priceForSection";

const appMethods = {
    uriLocationNoParam,
    apiLoadNames,
    apiLoadPrices,
    deckLoad,
    deckLoadUri,
    priceConvert,
    priceForCard,
    priceForSection,
    onFileChange(e) {
        const vm = this;
        const files = e.target.files || e.dataTransfer.files;

        vm.deckLoad(files[0]);
    }
};

export default appMethods;
