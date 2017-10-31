const getUrls = () => {
    if (location.host.includes("ygoprodeck")) {
        return {
            nameAPI: "https://ygoprodeck.com/priceapp/api/names/names.min.json",
            priceAPI: "https://ygoprodeck.com/priceapp/api/prices/prices.php?n=",
            imageAPI: "https://ygoprodeck.com/pics",
            buyAPI: "http://yugiohprices.com/card_price?name=",
        };
    } else {
        return {
            nameAPI: "./api/names/names.min.json",
            priceAPI: "./api/prices/prices.php?n=",
            imageAPI: "https://ygoprodeck.com/pics",
            buyAPI: "http://yugiohprices.com/card_price?name=",
        };
    }
};

export default getUrls;
