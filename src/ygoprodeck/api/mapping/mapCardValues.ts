import { getExistingElseThrow, requireNonNilElseThrow } from "lightdash";
import type { CardType, CardValues } from "@/core/lib";
import { CardTypeCategory, DeckPart } from "@/core/lib";

// https://jvilk.com/MakeTypes/
export interface RawCardValues {
	types: RawCardType[];
	MONSTER: RawMonsterTypeCategoryValues;
	SPELL: RawTypeCategoryValues;
	TRAP: RawTypeCategoryValues;
	SKILL: RawTypeCategoryValues;
}

interface RawCardType {
	name: string;
	group: string;
	sortGroup: number;
	area: string[];
}

interface RawMonsterTypeCategoryValues {
	type: string[];
	race: string[];
	attributes: string[];
	level: number[];
	linkmarkers: string[];
}

interface RawTypeCategoryValues {
	type: string[];
	race: string[];
}

const typeCategoryMap = new Map<string, CardTypeCategory>([
	["MONSTER", CardTypeCategory.MONSTER],
	["SPELL", CardTypeCategory.SPELL],
	["TRAP", CardTypeCategory.TRAP],
	["SKILL", CardTypeCategory.SKILL],
]);
const mapCategory = (type: RawCardType): CardTypeCategory =>
	getExistingElseThrow(typeCategoryMap, type.group);

const deckPartMap = new Map<string, DeckPart>([
	["MAIN", DeckPart.MAIN],
	["EXTRA", DeckPart.EXTRA],
	["SIDE", DeckPart.SIDE],
]);
const mapDeckPart = (type: RawCardType): Set<DeckPart> =>
	new Set(type.area.map((area) => getExistingElseThrow(deckPartMap, area)));

const mapTypes = (typeNames: string[], types: CardType[]): CardType[] =>
	typeNames.map((typeName) =>
		requireNonNilElseThrow(
			types.find((type) => type.name === typeName),
			() => new TypeError(`Could not find type '${typeName}'.`),
		),
	);

export const mapCardValues = (data: RawCardValues): CardValues => {
	const types: CardType[] = data.types.map((type) => {
		return {
			name: type.name,
			category: mapCategory(type),
			sortGroup: type.sortGroup,
			deckParts: mapDeckPart(type),
		};
	});
	return {
		[CardTypeCategory.MONSTER]: {
			types: mapTypes(data.MONSTER.type, types),
			subTypes: data.MONSTER.race,
			attributes: data.MONSTER.attributes,
			levels: data.MONSTER.level,
			linkMarkers: data.MONSTER.linkmarkers,
		},
		[CardTypeCategory.SPELL]: {
			types: mapTypes(data.SPELL.type, types),
			subTypes: data.SPELL.race,
		},
		[CardTypeCategory.TRAP]: {
			types: mapTypes(data.TRAP.type, types),
			subTypes: data.TRAP.race,
		},
		[CardTypeCategory.SKILL]: {
			types: mapTypes(data.SKILL.type, types),
			subTypes: data.SKILL.race,
		},
	};
};
