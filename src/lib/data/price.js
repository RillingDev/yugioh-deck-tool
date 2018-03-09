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
        val: 0.811
    },
    {
        id: "pound",
        name: "Pound",
        label: "£",
        val: 0.721
    },
    {
        id: "dollar_ca",
        name: "Canadian Dollar",
        label: "$",
        val: 1.282
    },
    {
        id: "dollar_au",
        name: "Australian Dollar",
        label: "$",
        val: 1.273
    }
];

Object.freeze(PRICE_MODES);
Object.freeze(PRICE_CURRENCIES);

export { PRICE_MODES, PRICE_CURRENCIES };
