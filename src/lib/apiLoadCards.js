import { inflate } from "./compress";
import CardDatabase from "./classes/cardDatabase";

const apiLoadCards = urls =>
    new Promise((resolve, reject) => {
        fetch(urls.nameAPI)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const json = JSON.parse(inflate(buffer));
                const cardDb = new CardDatabase(json);

                resolve(cardDb);
            })
            .catch(reject);
    });

export default apiLoadCards;
