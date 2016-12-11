"use strict";

const eachObject = function(object, fn) {
    const keys = Object.keys(object);
    const l = keys.length;
    let i = 0;

    while (i < l) {
        const currentKey = keys[i];

        fn(object[currentKey], currentKey, i);
        i++;
    }
};

export default eachObject;
