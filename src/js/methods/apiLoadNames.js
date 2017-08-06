"use strict";

import {
    nameAPI,
    imageAPI,
    buyAPI
} from "../data/apiURLs";
import utilEachObject from "./utilEachObject";

const apiLoadNames = function () {
    const vm = this;

    vm.ajax.currentlyLoading = true;
    vm.ajax.namesLoaded = false;

    fetch(nameAPI)
        .then(response => {
            return response.json();
        })
        .then(json => {
            const resultData = {};
            const resultPairs = [];
            const nameStorage = [];

            utilEachObject(json, (name, id) => {
                resultData[id] = {
                    name,
                    img: `${imageAPI}/${id}.jpg`,
                    link: `${buyAPI}${encodeURI(name)}`,
                    price: false
                };

                //Only add each card once to parts, skip alternate arts
                if (name.length > 0 && nameStorage.indexOf(name) === -1) {
                    resultPairs.push([id, name]);
                }

                nameStorage.push(name);
            });

            vm.cards.data = resultData;
            vm.cards.pairs = resultPairs.sort((a, b) => a[1].localeCompare(b[1]));
            vm.builderUpdateNames();

            vm.ajax.currentlyLoading = false;
            vm.ajax.namesLoaded = true;
        });
};

export default apiLoadNames;
