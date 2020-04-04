import { deepFreeze } from "lightdash";

interface Currency {
    readonly name: string;
    readonly locale: string;
    readonly id: string;
    readonly val: number;
    readonly fractionDigits: number;
}

// Values from https://api.exchangeratesapi.io/latest?base=USD
const DEFAULT_CURRENCY_ARR: Currency[] = [
    {
        name: "US Dollar",
        locale: "en-US",
        id: "USD",
        val: 1.0,
        fractionDigits: 2,
    },
    {
        name: "Euro",
        locale: "de-DE",
        id: "EUR",
        val: 0.9272137228,
        fractionDigits: 2,
    },
    {
        name: "British Pound",
        locale: "en-GB",
        id: "GBP",
        val: 0.8145572554,
        fractionDigits: 2,
    },
    {
        name: "Canadian Dollar",
        locale: "en-CA",
        id: "CAD",
        val: 1.4185442745,
        fractionDigits: 2,
    },
    {
        name: "Australian Dollar",
        locale: "en-AU",
        id: "AUD",
        val: 1.6693555865,
        fractionDigits: 2,
    },
    {
        name: "Mexican Peso",
        locale: "es-MX",
        id: "MXN",
        val: 24.6147426982,
        fractionDigits: 1,
    },
    {
        name: "Brazilian Real",
        locale: "pt-BR",
        id: "BRL",
        val: 5.2751970329,
        fractionDigits: 1,
    },
    {
        name: "Thai Baht",
        locale: "th-TH",
        id: "THB",
        val: 33.0097357441,
        fractionDigits: 0,
    },
    {
        name: "Indonesian Rupiah",
        locale: "id-ID",
        id: "IDR",
        val: 16614.4459898006,
        fractionDigits: 0,
    },
];
deepFreeze(DEFAULT_CURRENCY_ARR);

export { Currency, DEFAULT_CURRENCY_ARR };
