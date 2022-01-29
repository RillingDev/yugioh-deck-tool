import type { CardDataLoaderService } from "@yugioh-deck-tool/core";
import type { CardSet } from "@yugioh-deck-tool/core";
import type { UnlinkedCard } from "@yugioh-deck-tool/core";
import type { CardValues } from "@yugioh-deck-tool/core";
import { injectable } from "inversify";
import { CardTypeCategory } from "@yugioh-deck-tool/core";

@injectable()
export class MockDataLoaderService implements CardDataLoaderService {
	getAllCardSets(): Promise<CardSet[]> {
		return Promise.resolve([]);
	}

	getAllCards(): Promise<UnlinkedCard[]> {
		return Promise.resolve([]);
	}

	getArchetypes(): Promise<string[]> {
		return Promise.resolve([]);
	}

	getCard(): Promise<UnlinkedCard | null> {
		return Promise.resolve(null);
	}

	getCardValues(): Promise<CardValues> {
		return Promise.resolve({
			[CardTypeCategory.MONSTER]: {
				subTypes: [],
				types: [],
				attributes: [],
				levels: [],
				linkMarkers: [],
			},
			[CardTypeCategory.SPELL]: {
				subTypes: [],
				types: [],
			},
			[CardTypeCategory.TRAP]: {
				subTypes: [],
				types: [],
			},
			[CardTypeCategory.SKILL]: {
				subTypes: [],
				types: [],
			},
		});
	}
}
