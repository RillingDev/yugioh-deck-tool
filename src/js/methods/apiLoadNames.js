"use strict";

import {
    nameAPI,
    imageAPI,
    buyAPI
} from "../data/apiURLs";
import utilEachObject from "./utilEachObject";

const apiLoadNames = function() {
    const vm = this;
    const result = {};

    vm.ajax.currentlyLoading = true;
    vm.ajax.namesLoaded = false;

    fetch(nameAPI)
        .then(response => {
            return response.json();
        })
        .then(function(json) {
            let resultIds;
            let resultNames;
            let resultMap;

            utilEachObject(json, (name, id) => {
                result[id] = {
                    name,
                    img: `${imageAPI}/${id}.jpg`,
                    link: `${buyAPI}${encodeURI(name)}`,
                    price: false
                };
            });

            resultIds = Object.keys(result);
            resultNames = Object.values(result).map(item => item.name);
            resultMap = new Map(resultNames.map((item, index) => {
                return [item, resultIds[index]];
            }));

            vm.cards.data = result;
            vm.cards.names = resultNames.sort();
            vm.cards.mapNameToId = resultMap;
            vm.builderUpdateNames();

            vm.ajax.currentlyLoading = false;
            vm.ajax.namesLoaded = true;
        });
};

export default apiLoadNames;
