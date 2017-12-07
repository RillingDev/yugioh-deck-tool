const PRICE_MODES = [
    {
        id: "low",
        name: "Low"
    },
    {
        id: "average",
        name: "Average"
    },
    {
        id: "high",
        name: "High"
    }
];

const PRICE_CURRENCIES = [
    {
        id: "dollar_us",
        name: "US Dollar",
        label: "$",
        val: 1
    },
    {
        id: "euro",
        name: "Euro",
        label: "€",
        val: 0.846
    },
    {
        id: "pound",
        name: "Pound",
        label: "£",
        val: 0.748
    },
    {
        id: "dollar_ca",
        name: "Canadian Dollar",
        label: "$",
        val: 1.266
    },
    {
        id: "dollar_au",
        name: "Australian Dollar",
        label: "$",
        val: 1.317
    }
];

const PriceDatabase = class {
    constructor() {
        this.modes = PRICE_MODES;
        this.currencies = PRICE_CURRENCIES;

        this.activeCurrency = this.currencies[0];
        this.prices = new Map();
    }
    getCardsWithoutData(cardIdArr) {
        return cardIdArr.filter(cardId => !this.hasPrice(cardId));
    }
    setPrice(cardId, val) {
        this.prices.set(cardId, {
            low: val.low,
            average: val.average,
            high: val.high
        });
    }
    hasPrice(cardId) {
        return this.prices.has(cardId);
    }
    getPrice(cardId) {
        if (this.hasPrice(cardId)) {
            const item = this.prices.get(cardId);

            return [item.low, item.average, item.high];
        } else {
            return [0, 0, 0];
        }
    }
    getPriceSelection(cardIdArr) {
        const items = cardIdArr.map(cardId => this.getPrice(cardId));

        return items.reduce((accumulator, val) => [
            accumulator[0] + val[0],
            accumulator[1] + val[1],
            accumulator[2] + val[2]
        ]);
    }
    formatPrice(val) {
        const currency = this.activeCurrency;

        return (val * currency.val).toFixed(2) + currency.label;
    }
};

export default PriceDatabase;
