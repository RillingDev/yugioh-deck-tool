import { Currency } from "../../../core/src/main";

export const createCurrencyFormatter = (
    currency: Currency
): Intl.NumberFormat =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.id,
        minimumFractionDigits: currency.fractionDigits,
        maximumFractionDigits: currency.fractionDigits,
    });
