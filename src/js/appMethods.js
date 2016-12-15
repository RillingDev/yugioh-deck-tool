"use strict";

import deckLoad from "./methods/deckLoad";
import deckLoadUri from "./methods/deckLoadUri";
import uriLocationNoParam from "./methods/uriLocationNoParam";
import apiLoadNames from "./methods/apiLoadNames";

const appMethods = {
    uriLocationNoParam,
    apiLoadNames,
    deckLoad,
    deckLoadUri,
    onFileChange(e) {
        const vm = this;
        const files = e.target.files || e.dataTransfer.files;

        vm.deckLoad(files[0]);
    }
};

export default appMethods;
