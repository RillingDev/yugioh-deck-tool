"use strict";

import {
    nameAPI,
    imageAPI,
    buyAPI
} from "../data/apiURLs";

const apiLoadNames = function(idArr, cb) {
    const result = {};

    fetch(nameAPI)
        .then(response => {
            return response.json();
        })
        .then(function(json) {
            idArr.forEach(id => {
                const name = json[id];

                result[id] = {
                    name: name,
                    img: `${imageAPI}/${id}.jpg`,
                    link: `${buyAPI}${encodeURI(name)}`
                };
            });

            cb(result);
        });
};

export default apiLoadNames;
