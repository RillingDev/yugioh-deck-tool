import type { Card, CardType, Vendor } from "@/core/lib";
import {
	CardTypeCategory,
	DeckPart,
	DefaultBanState,
	Format,
} from "@/core/lib";

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

export const createCard = (data: Partial<Card>): Card => ({
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

	treatedAs: data.treatedAs ?? null,
	archetype: data.archetype ?? null,

	betaPasscode: data.betaPasscode ?? null,
	betaName: data.betaName ?? null,

	sets: data.sets ?? [],
	image: data.image ?? null,
	prices: data.prices ?? new Map<Vendor, number>(),

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
