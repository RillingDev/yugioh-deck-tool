const PRICE_MODES = [
    {
        id: "tcgplayer",
        name: "TCGPlayer"
    },
    {
        id: "cardmarket",
        name: "Cardmarket"
    },
    {
        id: "ebay",
        name: "eBay"
    }
];

const PRICE_CURRENCIES = [
    {
        name: "US Dollar",
        locale: "en-US",
        id: "USD",
        val: 1.0,
        fractionDigits: 2,
        formatter: null
    },
    {
        name: "Euro",
        locale: "de-DE",
        id: "EUR",
        val: 0.881,
        fractionDigits: 2,
        formatter: null
    },
    {
        name: "British Pound",
        locale: "en-GB",
        id: "GBP",
        val: 0.792,
        fractionDigits: 2,
        formatter: null
    },
    {
        name: "Canadian Dollar",
        locale: "en-CA",
        id: "CAD",
        val: 1.341,
        fractionDigits: 2,
        formatter: null
    },
    {
        name: "Australian Dollar",
        locale: "en-AU",
        id: "AUD",
        val: 1.393,
        fractionDigits: 2,
        formatter: null
    },
    {
        name: "Mexican Peso",
        locale: "es-MX",
        id: "MXN",
        val: 20.09,
        fractionDigits: 1,
        formatter: null
    },
    {
        name: "Brazilian Real",
        locale: "pt-BR",
        id: "BRL",
        val: 3.9,
        fractionDigits: 1,
        formatter: null
    },
    {
        name: "Thai Baht",
        locale: "th-TH",
        id: "THB",
        val: 32.8,
        fractionDigits: 0,
        formatter: null
    },
    {
        name: "Indonesian Rupiah",
        locale: "id-ID",
        id: "IDR",
        val: 14578,
        fractionDigits: 0,
        formatter: null
    }
];

export { PRICE_MODES, PRICE_CURRENCIES };
