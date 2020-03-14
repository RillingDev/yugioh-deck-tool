interface Currency {
    readonly name: string;
    readonly locale: string;
    readonly id: string;
    readonly val: number;
    readonly fractionDigits: number;
}

const DEFAULT_CURRENCY_ARR: Currency[] = [
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
        val: 0.881,
        fractionDigits: 2
    },
    {
        name: "British Pound",
        locale: "en-GB",
        id: "GBP",
        val: 0.792,
        fractionDigits: 2
    },
    {
        name: "Canadian Dollar",
        locale: "en-CA",
        id: "CAD",
        val: 1.341,
        fractionDigits: 2
    },
    {
        name: "Australian Dollar",
        locale: "en-AU",
        id: "AUD",
        val: 1.393,
        fractionDigits: 2
    },
    {
        name: "Mexican Peso",
        locale: "es-MX",
        id: "MXN",
        val: 20.09,
        fractionDigits: 1
    },
    {
        name: "Brazilian Real",
        locale: "pt-BR",
        id: "BRL",
        val: 3.9,
        fractionDigits: 1
    },
    {
        name: "Thai Baht",
        locale: "th-TH",
        id: "THB",
        val: 32.8,
        fractionDigits: 0
    },
    {
        name: "Indonesian Rupiah",
        locale: "id-ID",
        id: "IDR",
        val: 14578,
        fractionDigits: 0
    }
];

export { Currency, DEFAULT_CURRENCY_ARR };
