import { asConstant } from "../util";
import type { Currency } from "./Currency";
import { DefaultCurrency } from "./Currency";

export interface Vendor {
	readonly id: string;
	readonly name: string;
	readonly currency: Currency;
}

export const DefaultVendor = {
	CARD_MARKET: asConstant({
		name: "Cardmarket",
		id: "cardmarket",
		currency: DefaultCurrency.EUR,
	}),
	TCG_PLAYER: asConstant({
		name: "TCGPlayer",
		id: "tcgplayer",
		currency: DefaultCurrency.USD,
	}),
	COOL_STUFF_INC: asConstant({
		name: "CoolStuffInc",
		id: "coolstuffinc",
		currency: DefaultCurrency.USD,
	}),
} as const;

export const DEFAULT_VENDOR_ARR: readonly Vendor[] = [
	DefaultVendor.CARD_MARKET,
	DefaultVendor.TCG_PLAYER,
	DefaultVendor.COOL_STUFF_INC,
];
