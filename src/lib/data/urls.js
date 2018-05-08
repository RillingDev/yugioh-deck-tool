const joinUrl = (...arr) => arr.join("/");

const URL_YGOPRODECK = "https://ygoprodeck.com";
const URL_YGOPRODECK_APP = joinUrl(URL_YGOPRODECK, "decktool");

const getRelativeUrl = val =>
    location.host === "ygoprodeck.com"
        ? joinUrl(URL_YGOPRODECK_APP, val)
        : joinUrl(".", val);

const getUrls = () => {
    return {
        dbAPI: "https://db.ygoprodeck.com/card/?search=",
        wikiAPI: "http://yugioh.wikia.com/wiki/",
        imageAPI: joinUrl(URL_YGOPRODECK, "pics"),
        nameAPI: getRelativeUrl("api/names/names.min.json"),
        priceAPI: getRelativeUrl("api/prices/prices.php?n="),
        imageUnknown: getRelativeUrl("assets/unknown.png")
    };
};

export default getUrls;
