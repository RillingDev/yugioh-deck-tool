const PRICE_MODES = [{
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

const PRICE_CURRENCIES = [{
        name: "US Dollar",
        locale: "en-US",
        id: "USD",
        val: 1,
    },
    {
        name: "Euro",
        locale: "de",
        id: "EUR",
        val: 0.810,
    },
    {
        name: "British Pound",
        locale: "en-GB",
        id: "GBP",
        val: 0.702,
    },
    {
        name: "Canadian Dollar",
        locale: "en-CA",
        id: "CAD",
        val: 1.260,
    },
    {
        name: "Australian Dollar",
        locale: "en-AU",
        id: "AUD",
        val: 1.287,
    },
    {
        name: "Mexican Peso",
        locale: "es-MX",
        id: "MXN",
        val: 18.109,
    },
    {
        name: "Brazilian Real",
        locale: "pt-BR",
        id: "BRL",
        val: 3.421,
    },
    {
        name: "Thai Baht",
        locale: "th",
        id: "THB",
        val: 31.214,
    },
    {
        name: "Indonesian Rupiah",
        locale: "id",
        id: "IDR",
        val: 13756.23,
    }
];

Object.freeze(PRICE_MODES);
Object.freeze(PRICE_CURRENCIES);

export {
    PRICE_MODES,
    PRICE_CURRENCIES
};
