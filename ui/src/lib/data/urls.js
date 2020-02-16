const joinUrl = (...arr) => arr.join("/");

const getAppUrl = val =>
    joinUrl(IS_YGOPRODECK ? URL_YGOPRODECK_APP : "./", val);

const URL_YGOPRODECK = "https://ygoprodeck.com";
const URL_YGOPRODECK_APP = joinUrl(URL_YGOPRODECK, "decktool");
const IS_YGOPRODECK = location.host === "ygoprodeck.com";

const URL_DB_API = "https://db.ygoprodeck.com/card/?search=";
const URL_WIKI_API = "http://yugioh.wikia.com/wiki/";
const URL_PRICE_API = getAppUrl("api/prices/prices.php?n=");
const URL_BUY_API =
    "https://store.tcgplayer.com/massentry?partner=YGOPRODeck&productline=Yugioh&c=";
const URL_NAME_API = getAppUrl("api/names/names.min.json");
const URL_IMAGE_API = joinUrl(URL_YGOPRODECK, "pics");
const URL_IMAGE_UNKNOWN = getAppUrl("assets/unknown.png");

export {
    URL_DB_API,
    URL_WIKI_API,
    URL_PRICE_API,
    URL_BUY_API,
    URL_NAME_API,
    URL_IMAGE_API,
    URL_IMAGE_UNKNOWN
};
