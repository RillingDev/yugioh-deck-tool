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
        name: "US Dollar",
        label: "$",
        val: 1
    },
    {
        name: "Euro",
        label: "€",
        val: 0.805
    },
    {
        name: "British Pound",
        label: "£",
        val: 0.705
    },
    {
        name: "Canadian Dollar",
        label: "$",
        val: 1.286
    },
    {
        name: "Australian Dollar",
        label: "$",
        val: 1.297
    },

    {
        name: "Mexican Peso",
        label: "$",
        val: 18.33
    },
    {
        name: "Brazilian Real",
        label: "R$",
        val: 3.331
    },
    {
        name: "Thai Baht",
        label: "฿",
        val: 31.1864
    },
    {
        name: "Indonesian Rupiah",
        label: "Rp",
        val: 13742.86
    }
];

Object.freeze(PRICE_MODES);
Object.freeze(PRICE_CURRENCIES);

export { PRICE_MODES, PRICE_CURRENCIES };
