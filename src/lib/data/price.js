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
        locale: "en-US",
        id: "USD",
        val: 1.0,
        fractionDigits: 2
    },
    {
        name: "Euro",
        locale: "de-DE",
        id: "EUR",
        val: 0.817,
        fractionDigits: 2
    },
    {
        name: "British Pound",
        locale: "en-GB",
        id: "GBP",
        val: 0.715,
        fractionDigits: 2
    },
    {
        name: "Canadian Dollar",
        locale: "en-CA",
        id: "CAD",
        val: 1.283,
        fractionDigits: 2
    },
    {
        name: "Australian Dollar",
        locale: "en-AU",
        id: "AUD",
        val: 1.315,
        fractionDigits: 2
    },
    {
        name: "Mexican Peso",
        locale: "es-MX",
        id: "MXN",
        val: 18.84,
        fractionDigits: 1
    },
    {
        name: "Brazilian Real",
        locale: "pt-BR",
        id: "BRL",
        val: 3.47,
        fractionDigits: 1
    },
    {
        name: "Thai Baht",
        locale: "th-TH",
        id: "THB",
        val: 31.4,
        fractionDigits: 0
    },
    {
        name: "Indonesian Rupiah",
        locale: "id-ID",
        id: "IDR",
        val: 13881.6,
        fractionDigits: 0
    }
];

export { PRICE_MODES, PRICE_CURRENCIES };
