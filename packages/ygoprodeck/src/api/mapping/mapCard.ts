/* eslint-disable @typescript-eslint/naming-convention */

import { getExistingElseThrow } from "lightdash";
import type {
	BanState,
	CardImage,
	CardPrices,
	CardSetAppearance,
	ReleaseInfo,
	UnlinkedCard,
	Vendor,
} from "@yugioh-deck-tool/core";
import { DefaultBanState, DefaultVendor, Format } from "@yugioh-deck-tool/core";

// https://jvilk.com/MakeTypes/
export interface RawCard {
	id: number;
	name: string;
	desc: string;

	type: string;
	race: string;
	attribute?: string;
	atk?: number;
	def?: number;
	level?: number;
	scale?: number;
	linkval?: number;
	linkmarkers?: string[];

	card_sets?: RawCardSetAppearance[];
	card_images?: RawCardImage[];
	card_prices?: RawCardPrices[];

	archetype?: string;
	misc_info?: RawMiscInfo[];
	banlist_info?: RawBanListInfo;

	cardq?: number; // Only exists when querying collection
}

interface RawCardSetAppearance {
	set_name: string;
	set_code: string;
	set_rarity: string;
	set_price: string;
}

interface RawCardImage {
	id: number;
	image_url: string;
	image_url_small: string;
}

interface RawCardPrices {
	cardmarket_price: string;
	tcgplayer_price: string;
	ebay_price: string;
	amazon_price: string;
	coolstuffinc_price: string;
}

interface RawMiscInfo {
	views: number;
	viewsweek: number;
	upvotes: number;
	downvotes: number;
	treated_as?: string;
	beta_name?: string;
	formats?: string[];
	tcg_date?: string;
	ocg_date?: string;
}

interface RawBanListInfo {
	ban_tcg?: string;
	ban_ocg?: string;
	ban_goat?: string;
}

const banStateMap = new Map<string, BanState>([
	["Unlimited", DefaultBanState.UNLIMITED],
	["Semi-Limited", DefaultBanState.SEMI_LIMITED],
	["Limited", DefaultBanState.LIMITED],
	["Banned", DefaultBanState.BANNED],
]);
const mapBanState = (name: string | null): BanState => {
	if (name != null && banStateMap.has(name)) {
		return banStateMap.get(name)!;
	}
	return DefaultBanState.UNLIMITED;
};

const formatMap = new Map<string, Format>([
	["OCG", Format.OCG],
	["TCG", Format.TCG],
	["GOAT", Format.GOAT],
	["OCG GOAT", Format.OCG_GOAT],
	["Speed Duel", Format.SPEED_DUEL],
	["Rush Duel", Format.RUSH_DUEL],
	["Duel Links", Format.DUEL_LINKS],
]);
const mapFormats = (rawMiscInfo: RawMiscInfo | null): Format[] => {
	if (rawMiscInfo == null || rawMiscInfo.formats == null) {
		return [];
	}
	return rawMiscInfo.formats.map((format) =>
		getExistingElseThrow(formatMap, format)
	);
};

const mapCardSets = (rawCard: RawCard): CardSetAppearance[] => {
	if (rawCard.card_sets == null) {
		return [];
	}
	return rawCard.card_sets.map((rawSet) => {
		return {
			name: rawSet.set_name,
			code: rawSet.set_code,
		};
	});
};

// Map back against main source instead of google's CDN.
const mapCardImage = (imageUrl: string): string =>
	imageUrl.replace(
		"https://storage.googleapis.com/ygoprodeck.com/",
		"https://ygoprodeck.com/"
	);
const mapImage = (rawCard: RawCard): CardImage | null => {
	if (rawCard.card_images == null) {
		return null;
	}
	const image = rawCard.card_images[0];
	return {
		url: mapCardImage(image.image_url),
		urlSmall: mapCardImage(image.image_url_small),
	};
};

const mapPrices = (rawCard: RawCard): CardPrices => {
	const result = new Map<Vendor, number>();
	if (rawCard.card_prices != null) {
		const putPrice = (vendor: Vendor, price: string): void => {
			const priceValue = Number(price);

			// API puts "0" for no price, we skip those
			if (priceValue > 0) {
				result.set(vendor, priceValue);
			}
		};
		const prices = rawCard.card_prices[0];
		putPrice(DefaultVendor.CARD_MARKET, prices.cardmarket_price);
		putPrice(DefaultVendor.TCG_PLAYER, prices.tcgplayer_price);
		putPrice(DefaultVendor.COOL_STUFF_INC, prices.coolstuffinc_price);
	}
	return result;
};

const mapDateStringToTimestamp = (date: string | null): number | null => {
	if (date == null) {
		return null;
	}
	return new Date(date).getTime();
};
const mapRelease = (miscInfo: RawMiscInfo | null): ReleaseInfo => {
	return {
		[Format.TCG]: mapDateStringToTimestamp(miscInfo?.tcg_date ?? null),
		[Format.OCG]: mapDateStringToTimestamp(miscInfo?.ocg_date ?? null),
	};
};

export const mapCard = (rawCard: RawCard): UnlinkedCard => {
	const miscInfo: RawMiscInfo | null =
		rawCard.misc_info != null ? rawCard.misc_info[0] : null;
	return {
		passcode: String(rawCard.id),
		name: rawCard.name,
		description: rawCard.desc,

		type: rawCard.type,
		subType: rawCard.race,
		attribute: rawCard.attribute ?? null,
		atk: rawCard.atk ?? null,
		def: rawCard.def ?? null,
		level: rawCard.level ?? null,
		pendulumScale: rawCard.scale ?? null,
		linkRating: rawCard.linkval ?? null,
		linkMarkers: rawCard.linkmarkers ?? null,

		sets: mapCardSets(rawCard),
		image: mapImage(rawCard),
		prices: mapPrices(rawCard),

		betaName: miscInfo?.beta_name ?? null,
		treatedAs: miscInfo?.treated_as ?? null,
		archetype: rawCard.archetype ?? null,
		formats: mapFormats(miscInfo),
		release: mapRelease(miscInfo),
		banlist: {
			[Format.TCG]: mapBanState(rawCard.banlist_info?.ban_tcg ?? null),
			[Format.OCG]: mapBanState(rawCard.banlist_info?.ban_ocg ?? null),
			[Format.GOAT]: mapBanState(rawCard.banlist_info?.ban_goat ?? null),
		},

		views: miscInfo?.views ?? 0,
		quantity: rawCard.cardq ?? null,
	};
};
