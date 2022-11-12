import type { ReleaseInfo } from "./ReleaseInfo";
import type { Format } from "./format/Format";
import type { CardSet } from "./set/CardSet";
import type { CardType } from "./type/CardType";
import type { Vendor } from "@/core/price/Vendor";
import type { BanState } from "@/core/card/banlist/BanState";

export type CardPrices = ReadonlyMap<Vendor, number>;

export interface CardImage {
	readonly url: string;
	readonly urlSmall: string;
}

export interface BanlistInfo {
	readonly [Format.OCG]: BanState;
	readonly [Format.TCG]: BanState;
	readonly [Format.GOAT]: BanState;
}

/**
 * Regular card.
 */
export interface Card {
	/**
	 * Passcode/ID is an 8-digit unique code for each card
	 */
	readonly passcode: string;
	readonly name: string;
	readonly description: string;

	/**
	 * @see CardType
	 */
	readonly type: CardType;

	/**
	 * E.g. "Warrior" or "Equip Spell"
	 */
	readonly subType: string;

	readonly attribute: string | null;
	readonly atk: number | null;
	readonly def: number | null;
	readonly level: number | null;
	readonly pendulumScale: number | null;
	readonly linkRating: number | null;
	readonly linkMarkers: ReadonlyArray<string> | null;

	readonly betaName: string | null;
	readonly treatedAs: string | null;
	readonly archetype: string | null;

	readonly release: ReleaseInfo;
	readonly sets: ReadonlyArray<CardSet>;
	readonly formats: ReadonlyArray<Format>;
	readonly banlist: BanlistInfo;

	readonly image: CardImage | null;
	readonly prices: CardPrices;
	readonly views: number;
}
