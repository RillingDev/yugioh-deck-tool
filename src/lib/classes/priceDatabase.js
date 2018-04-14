import {
    PRICE_MODES,
    PRICE_CURRENCIES
} from "../data/price";

const PriceDatabase = class {
    constructor() {
        this.modes = PRICE_MODES;
        this.currencies = PRICE_CURRENCIES;
        this.activeCurrency = PRICE_CURRENCIES[0];
        this.prices = new Map();

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
