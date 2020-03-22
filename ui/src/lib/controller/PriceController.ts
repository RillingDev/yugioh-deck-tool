import { injectable } from "inversify";
import {
    Currency,
    DEFAULT_CURRENCY_ARR,
    DefaultVendor,
    Vendor,
} from "../../../../core/src/main";

@injectable()
class PriceController {
    public readonly activeCurrency: Currency;
    public readonly vendors: Vendor[];
    public readonly currencies: Currency[];

    constructor() {
        this.vendors = [
            DefaultVendor.TCGPLAYER,
            DefaultVendor.CARDMARKET,
            DefaultVendor.EBAY,
        ];
        this.currencies = DEFAULT_CURRENCY_ARR;
        this.activeCurrency = this.guessDefaultCurrency();
    }

    public format(val: number): string {
        const currency = this.activeCurrency;

        return this.createFormatter(currency).format(val * currency.val);
    }

    private guessDefaultCurrency() {
        const localeIndex = DEFAULT_CURRENCY_ARR.findIndex(
            (currency) => currency.locale === navigator.language
        );

        return localeIndex === -1
            ? DEFAULT_CURRENCY_ARR[0]
            : DEFAULT_CURRENCY_ARR[localeIndex];
    }

    private createFormatter(currency: Currency): Intl.NumberFormat {
        return new Intl.NumberFormat(currency.locale, {
            style: "currency",
            currency: currency.id,
            minimumFractionDigits: currency.fractionDigits,
            maximumFractionDigits: currency.fractionDigits,
        });
    }
}

export { PriceController };
