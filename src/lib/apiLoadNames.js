import getUrls from "./data/urls";
import {
    forEachEntry
} from "lightdash";

const apiLoadNames = function () {
    const vm = this;
    const urls = getUrls();

    vm.ajax.namesLoaded = false;

    fetch(urls.nameAPI)
        .then(response => response.json())
        .then(json => {
            const resultData = {};
            const resultPairs = [];
            const nameStorage = [];

            forEachEntry(json, (name, id) => {
                resultData[id] = {
                    name,
                    img: `${urls.imageAPI}/${id}.jpg`,
                    link: `${urls.buyAPI}${encodeURI(name)}`,
                    price: null
                };

                // Only add each card once to parts, skip alternate arts
                if (name.length > 0 && nameStorage.indexOf(name) === -1) {
                    resultPairs.push([id, name]);
                }

                nameStorage.push(name);
            });

            vm.cards.data = resultData;
            vm.cards.pairs = resultPairs.sort((a, b) => a[1].localeCompare(b[1]));
            // vm.builderUpdateNames();

            console.log(vm.cards);

            vm.ajax.namesLoaded = true;
        })
        .catch(console.error);
};

export default apiLoadNames;
