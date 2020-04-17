import { Currency } from "../../core/src/main";

export const createCurrencyFormatter = (
    currency: Currency
): Intl.NumberFormat =>
    new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.id,
        minimumFractionDigits: currency.fractionDigits,
        maximumFractionDigits: currency.fractionDigits,
    });
