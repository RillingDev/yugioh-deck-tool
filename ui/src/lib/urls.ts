const joinUrl = (...arr) => arr.join("/");

const IS_YGOPRODECK = location.host === "ygoprodeck.com";
const URL_YGOPRODECK = "https://ygoprodeck.com";
const URL_YGOPRODECK_APP = joinUrl(URL_YGOPRODECK, "decktool");
const getAppUrl = (val) =>
    joinUrl(IS_YGOPRODECK ? URL_YGOPRODECK_APP : "./", val);

const URL_DB_API = "https://db.ygoprodeck.com/card/?search=";
const URL_IMAGE_UNKNOWN = getAppUrl("assets/unknown.png");

export { URL_DB_API, URL_IMAGE_UNKNOWN };
