import type { CardDataLoaderService } from "@/core/lib";
import type { CardSet } from "@/core/lib";
import type { UnlinkedCard } from "@/core/lib";
import type { CardValues } from "@/core/lib";
import { injectable } from "inversify";
import { CardTypeCategory } from "@/core/lib";

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
