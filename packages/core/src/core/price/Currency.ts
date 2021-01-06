import { deepFreeze } from "lightdash";

interface Currency {
    /**
     * See {@link Intl.NumberFormatOptions#currency}.
     */
    readonly id: string;

    readonly name: string;

    /**
     * Value of 1 USD in this currency.
     */
    readonly conversionRate: number;

    readonly fractionDigits: number;
}

// Values from https://api.exchangeratesapi.io/latest?base=USD
const DefaultCurrency = {
    USD: {
        id: "USD",
        name: "US Dollar",
        conversionRate: 1.0,
        fractionDigits: 2,
    },
    EUR: {
        id: "EUR",
        name: "Euro",
        conversionRate: 0.845094228,
        fractionDigits: 2,
    },
    GBP: {
        id: "GBP",
        name: "British Pound",
        conversionRate: 0.7717231471,
        fractionDigits: 2,
    },
    CAD: {
        id: "CAD",
        name: "Canadian Dollar",
        conversionRate: 1.3184315051,
        fractionDigits: 2,
    },
    AUD: {
        id: "AUD",
        name: "Australian Dollar",
        conversionRate: 1.3726020451,
        fractionDigits: 2,
    },
    MXN: {
        id: "MXN",
        name: "Mexican Peso",
        conversionRate: 20.9028986732,
        fractionDigits: 1,
    },
    BRL: {
        id: "BRL",
        name: "Brazilian Real",
        conversionRate: 5.2544578721,
        fractionDigits: 1,
    },
    THB: {
        id: "THB",
        name: "Thai Baht",
        conversionRate: 31.1746809769,
        fractionDigits: 0,
    },
    IDR: {
        id: "IDR",
        name: "Indonesian Rupiah",
        conversionRate: 14735.003802924,
        fractionDigits: 0,
    },
} as const;
deepFreeze(DefaultCurrency);

const DEFAULT_CURRENCY_ARR: Currency[] = [
    DefaultCurrency.USD,
    DefaultCurrency.EUR,
    DefaultCurrency.GBP,
    DefaultCurrency.CAD,
    DefaultCurrency.AUD,
    DefaultCurrency.MXN,
    DefaultCurrency.BRL,
    DefaultCurrency.THB,
    DefaultCurrency.IDR,
];
deepFreeze(DEFAULT_CURRENCY_ARR);

export { Currency, DEFAULT_CURRENCY_ARR, DefaultCurrency };
