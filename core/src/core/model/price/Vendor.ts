import { deepFreeze } from "lightdash";
import { Currency, DefaultCurrency } from "./Currency";

interface Vendor {
    readonly id: string;
    readonly name: string;
    readonly currency: Currency;
}

const DefaultVendor: {
    readonly CARD_MARKET: Vendor;
    readonly TCG_PLAYER: Vendor;
    readonly COOL_STUFF_INC: Vendor;
} = {
    CARD_MARKET: {
        name: "Cardmarket",
        id: "cardmarket",
        currency: DefaultCurrency.EUR,
    },
    TCG_PLAYER: {
        name: "TCGPlayer",
        id: "tcgplayer",
        currency: DefaultCurrency.USD,
    },
    COOL_STUFF_INC: {
        name: "CoolStuffInc",
        id: "coolstuffinc",
        currency: DefaultCurrency.USD,
    },
};
deepFreeze(DefaultVendor);

const DEFAULT_VENDOR_ARR = [
    DefaultVendor.CARD_MARKET,
    DefaultVendor.TCG_PLAYER,
    DefaultVendor.COOL_STUFF_INC,
];
deepFreeze(DEFAULT_VENDOR_ARR);

export { Vendor, DefaultVendor, DEFAULT_VENDOR_ARR };
