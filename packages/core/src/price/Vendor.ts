import { deepFreeze } from "lightdash";
import type { Currency } from "./Currency";
import { DefaultCurrency } from "./Currency";

export interface Vendor {
    readonly id: string;
    readonly name: string;
    readonly currency: Currency;
}

const DefaultVendor = {
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
} as const;
deepFreeze(DefaultVendor);
export { DefaultVendor };

const DEFAULT_VENDOR_ARR = [
    DefaultVendor.CARD_MARKET,
    DefaultVendor.TCG_PLAYER,
    DefaultVendor.COOL_STUFF_INC,
];
deepFreeze(DEFAULT_VENDOR_ARR);
export { DEFAULT_VENDOR_ARR };
