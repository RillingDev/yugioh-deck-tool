import { asConstant } from "../util";
import { DeckPart } from "./Deck";

export interface DeckPartConfig {
	readonly name: string;
	readonly indicator: string;
	readonly min: number;
	readonly max: number;
	readonly recommended: number;
}

export const DefaultDeckPartConfig = {
	[DeckPart.MAIN]: asConstant({
		name: "Main",
		indicator: "#main",
		min: 40,
		max: 60,
		recommended: 40,
	}),
	[DeckPart.EXTRA]: asConstant({
		name: "Extra",
		indicator: "#extra",
		min: 0,
		max: 15,
		recommended: 15,
	}),
	[DeckPart.SIDE]: asConstant({
		name: "Side",
		indicator: "!side",
		min: 0,
		max: 15,
		recommended: 15,
	}),
} as const;
