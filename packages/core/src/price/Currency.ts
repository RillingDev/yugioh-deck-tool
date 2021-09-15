import { deepFreeze } from "lightdash";
import ConversionRatesJson from "./currencyConversionRates.json";

export interface Currency {
    /**
     * See {@link Intl.NumberFormatOptions#currency}.
     */
    readonly id: string;

    readonly name: string;

    readonly fractionDigits: number;

    /**
     * Value of 1 USD in this currency.
     */
    readonly conversionRate: number;
}

const ConversionRates = ConversionRatesJson as Record<string, number>;
const getConversionRate = (id: string): number => {
    if (id in ConversionRates) {
        return ConversionRates[id];
    }
    throw new TypeError(`No conversion rate found for '${id}'.`);
};

// Values from https://api.exchangeratesapi.io/latest?base=USD
const DefaultCurrency: Record<string, Currency> = {
    USD: {
        id: "USD",
        name: "US Dollar",
        fractionDigits: 2,
        conversionRate: getConversionRate("USD"),
    },
    EUR: {
        id: "EUR",
        name: "Euro",
        fractionDigits: 2,
        conversionRate: getConversionRate("EUR"),
    },
    GBP: {
        id: "GBP",
        name: "British Pound",
        fractionDigits: 2,
        conversionRate: getConversionRate("GBP"),
    },
    CAD: {
        id: "CAD",
        name: "Canadian Dollar",
        fractionDigits: 2,
        conversionRate: getConversionRate("CAD"),
    },
    AUD: {
        id: "AUD",
        name: "Australian Dollar",
        fractionDigits: 2,
        conversionRate: getConversionRate("AUD"),
    },
    MXN: {
        id: "MXN",
        name: "Mexican Peso",
        fractionDigits: 1,
        conversionRate: getConversionRate("MXN"),
    },
    BRL: {
        id: "BRL",
        name: "Brazilian Real",
        fractionDigits: 1,
        conversionRate: getConversionRate("BRL"),
    },
    THB: {
        id: "THB",
        name: "Thai Baht",
        fractionDigits: 0,
        conversionRate: getConversionRate("THB"),
    },
    IDR: {
        id: "IDR",
        name: "Indonesian Rupiah",
        fractionDigits: 0,
        conversionRate: getConversionRate("IDR"),
    },
} as const;
deepFreeze(DefaultCurrency);
export { DefaultCurrency };

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
export { DEFAULT_CURRENCY_ARR };
