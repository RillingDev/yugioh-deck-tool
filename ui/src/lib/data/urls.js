const joinUrl = (...arr) => arr.join("/");

const getAppUrl = val =>
    joinUrl(IS_YGOPRODECK ? URL_YGOPRODECK_APP : "./", val);

const URL_YGOPRODECK = "https://ygoprodeck.com";
const URL_YGOPRODECK_APP = joinUrl(URL_YGOPRODECK, "decktool");
const IS_YGOPRODECK = location.host === "ygoprodeck.com";

const URL_DB_API = "https://db.ygoprodeck.com/card/?search=";
const URL_BUY_API =
    "https://store.tcgplayer.com/massentry?partner=YGOPRODeck&productline=Yugioh&c=";
const URL_IMAGE_UNKNOWN = getAppUrl("assets/unknown.png");

export { URL_DB_API, URL_BUY_API, URL_IMAGE_UNKNOWN };
