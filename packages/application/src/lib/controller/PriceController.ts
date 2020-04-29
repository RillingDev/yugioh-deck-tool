import { inject, injectable } from "inversify";
import {
    Card,
    Currency,
    DEFAULT_CURRENCY_ARR,
    DEFAULT_VENDOR_ARR,
    DefaultCurrency,
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
        this.vendors = DEFAULT_VENDOR_ARR;
        this.currencies = DEFAULT_CURRENCY_ARR;
        this.activeCurrency = DefaultCurrency.USD;
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
        return this.priceService.formatPrice(val, this.activeCurrency);
    }
}

export { PriceController };
