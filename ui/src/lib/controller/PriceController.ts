import { PRICE_CURRENCIES, PRICE_MODES } from "../data/price";
import { injectable } from "inversify";

@injectable()
class PriceController {
    public readonly modes: any[];
    public readonly currencies: any[];
    public readonly activeCurrency: any;

    constructor() {
        this.modes = PRICE_MODES;
        this.currencies = this.mapCurrencyFormatters();
        this.activeCurrency = this.guessDefaultCurrency();
    }

    public format(val: number): string {
        const currency = this.activeCurrency;

        return currency.formatter.format(val * currency.val);
    }

    private mapCurrencyFormatters() {
        return PRICE_CURRENCIES.map(currency => {
            currency.formatter = new Intl.NumberFormat(currency.locale, {
                style: "currency",
                currency: currency.id,
                minimumFractionDigits: currency.fractionDigits,
                maximumFractionDigits: currency.fractionDigits
            });

            return currency;
        });
    }

    private guessDefaultCurrency() {
        const localeIndex = PRICE_CURRENCIES.findIndex(
            currency => currency.locale === navigator.language
        );

        return localeIndex === -1
            ? PRICE_CURRENCIES[0]
            : PRICE_CURRENCIES[localeIndex];
    }
}

export { PriceController };
