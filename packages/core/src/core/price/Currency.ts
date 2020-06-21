import { deepFreeze } from "lightdash";

interface Currency {
    readonly id: string;
    readonly name: string;
    readonly conversionRate: number; // Value of 1 USD in this currency
    readonly fractionDigits: number;
}

// Values from https://api.exchangeratesapi.io/latest?base=USD
const DefaultCurrency: {
    USD: Currency;
    EUR: Currency;
    GBP: Currency;
    CAD: Currency;
    AUD: Currency;
    MXN: Currency;
    BRL: Currency;
    THB: Currency;
    IDR: Currency;
} = {
    USD: {
        id: "USD",
        name: "US Dollar",
        conversionRate: 1.0,
        fractionDigits: 2,
    },
    EUR: {
        id: "EUR",
        name: "Euro",
        conversionRate: 0.9272137228,
        fractionDigits: 2,
    },
    GBP: {
        id: "GBP",
        name: "British Pound",
        conversionRate: 0.8145572554,
        fractionDigits: 2,
    },
    CAD: {
        id: "CAD",
        name: "Canadian Dollar",
        conversionRate: 1.4185442745,
        fractionDigits: 2,
    },
    AUD: {
        id: "AUD",
        name: "Australian Dollar",
        conversionRate: 1.6693555865,
        fractionDigits: 2,
    },
    MXN: {
        id: "MXN",
        name: "Mexican Peso",
        conversionRate: 24.6147426982,
        fractionDigits: 1,
    },
    BRL: {
        id: "BRL",
        name: "Brazilian Real",
        conversionRate: 5.2751970329,
        fractionDigits: 1,
    },
    THB: {
        id: "THB",
        name: "Thai Baht",
        conversionRate: 33.0097357441,
        fractionDigits: 0,
    },
    IDR: {
        id: "IDR",
        name: "Indonesian Rupiah",
        conversionRate: 16614.4459898006,
        fractionDigits: 0,
    },
};
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
