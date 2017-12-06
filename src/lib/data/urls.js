const joinUrl = (...arr) => arr.join("/");

const URL_YGOPRODECK = "https://ygoprodeck.com";
const URL_YGOPRODECK_APP = joinUrl(URL_YGOPRODECK, "priceapp");

const getUrls = () => {
    const getRelativeUrl = val =>
        location.host === "ygoprodeck.com"
            ? joinUrl(URL_YGOPRODECK_APP, val)
            : joinUrl(".", val);

    return {
        buyAPI: "http://yugiohprices.com/card_price?name=",
        imageAPI: joinUrl(URL_YGOPRODECK, "pics"),
        imageUnkown: getRelativeUrl("assets/unknown.png"),
        nameAPI: getRelativeUrl("api/names/names.json.gz"),
        priceAPI: getRelativeUrl("api/prices/prices.php?n=")
    };
};

export default getUrls;
