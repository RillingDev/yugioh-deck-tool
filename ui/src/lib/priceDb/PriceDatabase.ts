import { PRICE_CURRENCIES, PRICE_MODES } from "../data/price";
import deepFreeze from "../deepFreeze";
import logger from "loglevel";
import CardDatabase from "../cardDb/CardDatabase";

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

const PriceDatabase = class {
    private modes: any[];
    private currencies: any[];
    private activeCurrency: any;
    private readonly cardDb: CardDatabase;

    constructor(cardDb: CardDatabase) {
        this.modes = PRICE_MODES;
        this.currencies = mapCurrencyFomatters();
        this.activeCurrency = guessDefaultCurrency();
        this.cardDb = cardDb;

        deepFreeze(this.modes);

        logger.info("LOADED Prices", this);
    }

    has(cardId: string): boolean {
        return (
            this.cardDb.has(cardId) && this.cardDb.get(cardId).prices != null
        );
    }

    get(cardId) {
        if (!this.has(cardId)) {
            return [0, 0, 0];
        }
        const prices = this.cardDb.get(cardId).prices;
        return [prices.tcgplayer, prices.cardmarket, prices.ebay];
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
