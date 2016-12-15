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
            utilEachObject(json, (name, id) => {
                result[id] = {
                    name,
                    img: `${imageAPI}/${id}.jpg`,
                    link: `${buyAPI}${encodeURI(name)}`,
                    price: false
                };
            });

            vm.cards.data = result;

            vm.ajax.currentlyLoading = false;
            vm.ajax.namesLoaded = true;
        });
};

export default apiLoadNames;
