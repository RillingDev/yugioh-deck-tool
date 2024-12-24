import { getExistingElseThrow } from "lightdash";
import type {
	BanState,
	Card,
	CardImage,
	CardPrices,
	CardSet,
	CardType,
	ReleaseInfo,
	Vendor,
} from "@/core/lib";
import { DefaultBanState, DefaultVendor, Format, getLogger } from "@/core/lib";

const logger = getLogger("mapCard");

// https://jvilk.com/MakeTypes/
export interface RawCard {
	/**
	 * Equals passcode of a card
	 */
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

	/**
	 * card quantity.
	 * Only exists when querying collection
	 */
	cardq?: number;
}

interface RawCardSetAppearance {
	set_name: string;
	set_code: string;
	set_rarity: string;
	set_rarity_code: string;
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
	beta_id?: number;
	beta_name?: string;
	downvotes: number;
	formats?: string[];
	ocg_date?: string;
	tcg_date?: string;
	treated_as?: string;
	upvotes: number;
	views: number;
	viewsweek: number;
	has_effect?: number;
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
	["Common Charity", Format.COMMON_CHARITY],
	["Edison", Format.EDISON],
	["Master Duel", Format.MASTER_DUEL],
]);
const mapFormats = (rawMiscInfo: RawMiscInfo | null): Format[] => {
	if (rawMiscInfo?.formats == null) {
		return [];
	}
	return rawMiscInfo.formats.map((format) =>
		getExistingElseThrow(formatMap, format),
	);
};

const mapCardSets = (
	rawCard: RawCard,
	setsByName: ReadonlyMap<string, CardSet>,
): CardSet[] => {
	if (rawCard.card_sets == null) {
		return [];
	}
	return rawCard.card_sets
		.filter((rawSet) => {
			if (!setsByName.has(rawSet.set_name)) {
				logger.warn(`Could not find set '${rawSet.set_name}'.`);
				return false;
			}
			return true;
		})
		.map((rawSet) => setsByName.get(rawSet.set_name)!);
};

const mapImage = (rawCard: RawCard): CardImage | null => {
	if (rawCard.card_images == null) {
		return null;
	}
	const image = rawCard.card_images[0];
	return {
		url: image.image_url,
		urlSmall: image.image_url_small,
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

const mapType = (
	typeName: string,
	typesByName: ReadonlyMap<string, CardType>,
): CardType => {
	if (!typesByName.has(typeName)) {
		throw new TypeError(`Could not find type '${typeName}'.`);
	}
	return typesByName.get(typeName)!;
};

export const mapCard = (
	rawCard: RawCard,
	setsByName: ReadonlyMap<string, CardSet>,
	typesByName: ReadonlyMap<string, CardType>,
): Card => {
	const miscInfo: RawMiscInfo | null =
		rawCard.misc_info != null ? rawCard.misc_info[0] : null;
	return {
		passcode: String(rawCard.id),
		name: rawCard.name,
		description: rawCard.desc,

		type: mapType(rawCard.type, typesByName),
		subType: rawCard.race,
		attribute: rawCard.attribute ?? null,
		atk: rawCard.atk ?? null,
		def: rawCard.def ?? null,
		level: rawCard.level ?? null,
		pendulumScale: rawCard.scale ?? null,
		linkRating: rawCard.linkval ?? null,
		linkMarkers: rawCard.linkmarkers ?? null,

		treatedAs: miscInfo?.treated_as ?? null,
		archetype: rawCard.archetype ?? null,

		betaPasscode:
			miscInfo?.beta_id != null ? String(miscInfo.beta_id) : null,
		betaName: miscInfo?.beta_name ?? null,

		release: mapRelease(miscInfo),
		sets: mapCardSets(rawCard, setsByName),
		formats: mapFormats(miscInfo),
		banlist: {
			[Format.TCG]: mapBanState(rawCard.banlist_info?.ban_tcg ?? null),
			[Format.OCG]: mapBanState(rawCard.banlist_info?.ban_ocg ?? null),
			[Format.GOAT]: mapBanState(rawCard.banlist_info?.ban_goat ?? null),
		},

		image: mapImage(rawCard),
		prices: mapPrices(rawCard),
		views: miscInfo?.views ?? 0,
	};
};
