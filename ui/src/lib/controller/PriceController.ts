import { inject, injectable } from "inversify";
import {
    Card,
    Currency,
    DEFAULT_CURRENCY_ARR,
    DefaultVendor,
    PriceService,
    TYPES,
    Vendor,
} from "../../../../core/src/main";

@injectable()
class PriceController {
    public readonly activeCurrency: Currency;
    public readonly vendors: Vendor[];
    public readonly currencies: Currency[];
    private readonly priceService: PriceService;

    constructor(@inject(TYPES.PriceService) priceService: PriceService) {
        this.priceService = priceService;
        this.vendors = [
            DefaultVendor.TCGPLAYER,
            DefaultVendor.CARDMARKET,
            DefaultVendor.COOL_STUFF_INC,
        ];
        this.currencies = DEFAULT_CURRENCY_ARR;
        this.activeCurrency = this.guessDefaultCurrency();
    }

    public getPriceByVendor(cards: Card[]): Map<Vendor, number> {
        return new Map<Vendor, number>(
            this.vendors.map((vendor) => {
                const price = this.priceService.getPrice(
                    cards,
                    vendor,
                    this.activeCurrency
                );
                return [vendor, price.price];
            })
        );
    }

    public format(val: number): string {
        return this.createFormatter(this.activeCurrency).format(val);
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
