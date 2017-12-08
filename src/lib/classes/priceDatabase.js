import { isDefined } from "lightdash";
import { PRICE_MODES, PRICE_CURRENCIES } from "../data/price";

const PriceDatabase = class {
    constructor() {
        this.modes = PRICE_MODES;
        this.currencies = PRICE_CURRENCIES;

        this.activeCurrency = this.currencies[0];
        this.prices = new Map();

        console.log("LOADED Prices", this);
    }
    getCardsWithoutData(cardIdArr) {
        return cardIdArr.filter(cardId => !this.has(cardId));
    }
    set(cardId, val) {
        if (isDefined(val.low)) {
            return this.prices.set(cardId, {
                low: val.low,
                average: val.average,
                high: val.high
            });
        } else {
            return false;
        }
    }
    has(cardId) {
        return this.prices.has(cardId);
    }
    get(cardId) {
        if (this.has(cardId)) {
            const item = this.prices.get(cardId);

            return [item.low, item.average, item.high];
        } else {
            return [0, 0, 0];
        }
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

        return (val * currency.val).toFixed(2) + currency.label;
    }
};

export default PriceDatabase;
