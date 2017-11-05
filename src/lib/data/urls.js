const getUrls = () => {
    const isYgoProDeck = location.host === "ygoprodeck.com";

    return {
        imageAPI: "https://ygoprodeck.com/pics",
        buyAPI: "http://yugiohprices.com/card_price?name=",
        nameAPI: isYgoProDeck ? "https://ygoprodeck.com/priceapp/api/names/names.min.json" : "./api/names/names.min.json",
        priceAPI: isYgoProDeck ? "https://ygoprodeck.com/priceapp/api/prices/prices.php?n=" : "./api/prices/prices.php?n="
    };
};

export default getUrls;
