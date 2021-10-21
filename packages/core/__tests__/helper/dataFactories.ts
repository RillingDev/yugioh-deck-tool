import type { Card } from "../../src/card/Card";
import { Format } from "../../src/card/format/Format";
import type { CardImage } from "../../src/card/CardImage";
import type { CardPrices } from "../../src/card/CardPrices";
import type { ReleaseInfo } from "../../src/card/ReleaseInfo";
import type { BanlistInfo } from "../../src/card/banlist/BanlistInfo";
import type { CardType } from "../../src/card/type/CardType";
import type { CardSet } from "../../src/card/set/CardSet";
import { CardTypeCategory } from "../../src/card/type/CardTypeCategory";
import { DefaultBanState } from "../../src/card/banlist/BanState";
import type { Vendor } from "../../src/price/Vendor";
import { DeckPart } from "../../src/deck/DeckPart";

export const createCardType = (data: {
	name?: string;
	group?: CardTypeCategory;
	sortGroup?: number;
	deckPart?: Set<DeckPart>;
}): CardType => ({
	name: data.name ?? "Spell Card",
	category: data.group ?? CardTypeCategory.SPELL,
	sortGroup: data.sortGroup ?? 0,
	deckParts: data.deckPart ?? new Set([DeckPart.MAIN, DeckPart.SIDE]),
});

export const createCard = (data: {
	passcode?: string;
	name?: string;
	description?: string;

	type?: CardType;
	subType?: string;
	attribute?: string | null;
	atk?: number | null;
	def?: number | null;
	level?: number | null;
	pendulumScale?: number | null;
	linkRating?: number | null;
	linkMarkers?: string[] | null;

	sets?: CardSet[];
	image?: CardImage | null;
	prices?: CardPrices | null;

	betaName?: string | null;
	treatedAs?: string | null;
	archetype?: string | null;
	formats?: Format[];
	release?: ReleaseInfo;
	banlist?: BanlistInfo;

	views?: number;
}): Card => ({
	passcode: data.passcode ?? "123",
	name: data.name ?? "name",
	description: data.description ?? "desc",

	type: data.type ?? createCardType({}),
	subType: data.subType ?? "sub type",

	attribute: data.attribute ?? null,
	atk: data.atk ?? null,
	def: data.def ?? null,
	level: data.level ?? null,
	pendulumScale: data.pendulumScale ?? null,
	linkRating: data.linkRating ?? null,
	linkMarkers: data.linkMarkers ?? null,

	sets: data.sets ?? [],
	image: data.image ?? null,
	prices: data.prices ?? new Map<Vendor, number>(),
	betaName: data.betaName ?? null,
	treatedAs: data.treatedAs ?? null,
	archetype: data.archetype ?? null,

	formats: data.formats ?? [Format.TCG, Format.OCG],
	release: {
		[Format.TCG]: data.release?.TCG ?? null,
		[Format.OCG]: data.release?.OCG ?? null,
	},
	banlist: {
		[Format.TCG]: data.banlist?.TCG ?? DefaultBanState.UNLIMITED,
		[Format.OCG]: data.banlist?.OCG ?? DefaultBanState.UNLIMITED,
		[Format.GOAT]: data.banlist?.GOAT ?? DefaultBanState.UNLIMITED,
	},

	views: data.views ?? 0,
});
