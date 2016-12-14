"use strict";

import {
    nameAPI,
    imageAPI
} from "../data/apiURLs";

const apiLoadNames = function(idArr) {
    const result = {};

    fetch(nameAPI)
        .then(response => {
            return response.json();
        })
        .then(function(json) {
            idArr.forEach(id => {
                result[id] = {
                    name: json[id],
                    image: `${imageAPI}/${id}.jpg`
                };
            });
        });

    return result;
};

export default apiLoadNames;
