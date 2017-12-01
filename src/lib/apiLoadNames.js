import {
    forEachEntry,
    arrFrom
} from "lightdash";

const sortMapEntries = (map, fn) => new Map(arrFrom(map.entries()).sort(fn));

const apiLoadNames = urls => new Promise((resolve, reject) => {
    fetch(urls.nameAPI)
        .then(response => response.json())
        .then(json => {
            const nameCache = new Set();
            const data = new Map();
            const dataUniquePairs = new Map();

            forEachEntry(json, (name, id) => {
                if (name.length > 0) {
                    data.set(id, name);

                    // Only add each card once to parts, skip alternate arts
                    if (!nameCache.has(name)) {
                        dataUniquePairs.set(id, name);
                    }

                    nameCache.add(name);
                }
            });

            resolve({
                data,
                pairs: sortMapEntries(dataUniquePairs, (entryA, entryB) => entryA[1].localeCompare(entryB[1]))
            });
        })
        .catch(reject);
});

export default apiLoadNames;
