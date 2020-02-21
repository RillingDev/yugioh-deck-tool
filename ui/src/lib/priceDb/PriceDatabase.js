import { PRICE_CURRENCIES, PRICE_MODES } from "../data/price";
import deepFreeze from "../deepFreeze";
import logger from "loglevel";

const mapCurrencyFomatters = () =>
    PRICE_CURRENCIES.map(currency => {
        currency.formatter = new Intl.NumberFormat(currency.locale, {
            style: "currency",
            currency: currency.id,
            minimumFractionDigits: currency.fractionDigits,
            maximumFractionDigits: currency.fractionDigits
        });

        return currency;
    });

const guessDefaultCurrency = () => {
    const localeIndex = PRICE_CURRENCIES.findIndex(
        currency => currency.locale === navigator.language
    );

    return localeIndex === -1
        ? PRICE_CURRENCIES[0]
        : PRICE_CURRENCIES[localeIndex];
};

const createIdMap = cardArr => {
    const result = new Map();
    for (const card of cardArr) {
        if (card.prices.length > 0) {
            result.set(String(card.id), [
                Number(card.prices[0].tcgplayer),
                Number(card.prices[0].cardmarket),
                Number(card.prices[0].ebay)
            ]);
        }
    }
    return result;
};

const PriceDatabase = class {
    constructor(cardInfo = []) {
        this.modes = PRICE_MODES;
        this.currencies = mapCurrencyFomatters();
        this.activeCurrency = guessDefaultCurrency();
        this.prices = createIdMap(cardInfo);

        deepFreeze(this.modes);

        logger.log("LOADED Prices", this);
    }

    has(cardId) {
        return this.prices.has(cardId);
    }

    get(cardId) {
        if (!this.has(cardId)) {
            return [0, 0, 0];
        }
        return this.prices.get(cardId);
    }

    getSelection(cardIdArr) {
        if (cardIdArr.length === 0) {
            return [0, 0, 0];
        }
        const items = cardIdArr.map(cardId => this.get(cardId));

        return items.reduce((accumulator, val) => [
            accumulator[0] + val[0],
            accumulator[1] + val[1],
            accumulator[2] + val[2]
        ]);
    }

    format(val) {
        const currency = this.activeCurrency;

        return currency.formatter.format(val * currency.val);
    }
};

export default PriceDatabase;
