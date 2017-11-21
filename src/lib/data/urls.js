const getUrls = () => {
    const isYgoProDeck = location.host === "ygoprodeck.com";
    const ygoProDeckAppDir = "https://ygoprodeck.com/priceapp";

    return {
        buyAPI: "http://yugiohprices.com/card_price?name=",
        imageAPI: "https://ygoprodeck.com/pics",
        imageUnkown: isYgoProDeck ? ygoProDeckAppDir + "/assets/unknown.png" : "./assets/unknown.png",
        nameAPI: isYgoProDeck ? ygoProDeckAppDir + "/api/names/names.min.json" : "./api/names/names.min.json",
        priceAPI: isYgoProDeck ? ygoProDeckAppDir + "/api/prices/prices.php?n=" : "./api/prices/prices.php?n="
    };
};

export default getUrls;
