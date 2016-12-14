"use strict";

import {
    nameAPI,
    imageAPI
} from "../data/apiURLs";

const apiLoadNames = function(idArr, cb) {
    const result = {};

    fetch(nameAPI)
        .then(response => {
            return response.json();
        })
        .then(function(json) {
            idArr.forEach(id => {
                result[id] = {
                    name: json[id],
                    img: `${imageAPI}/${id}.jpg`
                };
            });

            cb(result);
        });
};

export default apiLoadNames;
