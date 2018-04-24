import {
    PRICE_MODES,
    PRICE_CURRENCIES
} from "../data/price";

const mapCurrencyFomatters = () => PRICE_CURRENCIES.map(currency => {
    currency.formatter = new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.id,
        minimumFractionDigits: currency.fractionDigits,
        maximumFractionDigits: currency.fractionDigits
    });

    return currency;
});
const guessDefaultCurrency = () => {
    const localeIndex = PRICE_CURRENCIES.findIndex(currency => currency.locale === navigator.language);

    return localeIndex === -1 ? PRICE_CURRENCIES[0] : PRICE_CURRENCIES[localeIndex];
}

const PriceDatabase = class {
    constructor() {
        this.modes = PRICE_MODES;
        this.currencies = mapCurrencyFomatters();
        this.activeCurrency = guessDefaultCurrency();
        this.prices = new Map();

        Object.freeze(this.modes);
        Object.freeze(this.currencies);

        // eslint-disable-next-line no-console
        console.log("LOADED Prices", this);
    }
    getCardsWithoutData(cardIdArr) {
        return cardIdArr.filter(cardId => !this.has(cardId));
    }
    set(cardId, val) {
        if (val !== null) {
            return this.prices.set(cardId, {
                low: val[0],
                average: val[1],
                high: val[2]
            });
        }

        return false;
    }
    has(cardId) {
        return this.prices.has(cardId);
    }
    get(cardId) {
        if (this.has(cardId)) {
            const item = this.prices.get(cardId);

            return [item.low, item.average, item.high];
        }

        return [0, 0, 0];
    }
    getSelection(cardIdArr) {
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
