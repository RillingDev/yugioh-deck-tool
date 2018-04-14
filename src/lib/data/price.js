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
        formatter: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }),
        val: 1,
    },
    {
        name: "Euro",
        formatter: new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }),
        val: 0.810,
    },
    {
        name: "British Pound",
        formatter: new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP"
        }),
        val: 0.702,
    },
    {
        name: "Canadian Dollar",
        formatter: new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD"
        }),
        val: 1.260,
    },
    {
        name: "Australian Dollar",
        formatter: new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: "AUD"
        }),
        val: 1.287,
    },
    {
        name: "Mexican Peso",
        formatter: new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN"
        }),
        val: 18.109,
    },
    {
        name: "Brazilian Real",
        formatter: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }),
        val: 3.421,
    },
    {
        name: "Thai Baht",
        formatter: new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB"
        }),
        val: 31.214,
    },
    {
        name: "Indonesian Rupiah",
        formatter: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        }),
        val: 13756.23,
    }
];

Object.freeze(PRICE_MODES);
Object.freeze(PRICE_CURRENCIES);

export {
    PRICE_MODES,
    PRICE_CURRENCIES
};
