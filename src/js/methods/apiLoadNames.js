"use strict";

import {
    nameAPI,
    imageAPI,
    buyAPI
} from "../data/apiURLs";
import utilEachObject from "./utilEachObject";

const apiLoadNames = function(cb) {
    const vm = this;
    const result = {};

    fetch(nameAPI)
        .then(response => {
            return response.json();
        })
        .then(function(json) {
            utilEachObject(json, (name, id) => {
                result[id] = {
                    name,
                    img: `${imageAPI}/${id}.jpg`,
                    link: `${buyAPI}${encodeURI(name)}`
                };
            });

            vm.cards.data = result;
        });
};

export default apiLoadNames;
