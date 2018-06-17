import { URL_NAME_API } from "../data/urls";

/* import { inflate } from "../compress"; */

const apiLoadCards = () =>
    new Promise((resolve, reject) => {
        fetch(URL_NAME_API, {
            mode: "same-origin"
        })
            /*  .then(response => response.arrayBuffer())
            .then(buffer => resolve(JSON.parse(inflate( buffer )))) */
            .then(response => response.json())
            .then(resolve)
            .catch(reject);
    });

export default apiLoadCards;
