import {
    forEachEntry
} from "lightdash";

const apiLoadNames = (urls) => new Promise((resolve, reject) => {
    fetch(urls.nameAPI)
        .then(response => response.json())
        .then(json => {
            const data = {};
            const pairs = [];
            const nameStorage = [];

            forEachEntry(json, (name, id) => {
                data[id] = {
                    name,
                    id, // : `${urls.imageAPI}/${id}.jpg`
                    price: null
                };

                // Only add each card once to parts, skip alternate arts
                if (name.length > 0 && nameStorage.indexOf(name) === -1) {
                    pairs.push([id, name]);
                }

                nameStorage.push(name);
            });

            pairs.sort((a, b) => a[1].localeCompare(b[1]));

            resolve({
                data,
                pairs,
            });
        })
        .catch(reject);
});

export default apiLoadNames;
