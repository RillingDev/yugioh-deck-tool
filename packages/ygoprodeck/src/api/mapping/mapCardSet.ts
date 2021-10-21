/* eslint-disable @typescript-eslint/naming-convention */

import type { CardSet } from "@yugioh-deck-tool/core";

// https://jvilk.com/MakeTypes/
export interface RawCardSet {
	set_name: string;
	set_code: string;
	num_of_cards: number;
	tcg_date: string;
}

export const mapCardSet = (rawCardSet: RawCardSet): CardSet => {
	return {
		name: rawCardSet.set_name,
		code: rawCardSet.set_code,
	};
};
