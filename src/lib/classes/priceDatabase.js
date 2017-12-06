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

        console.log(this);
    }
    fetchPrices(cardIdArr) {}
    getPrice() {}
};

export default PriceDatabase;
