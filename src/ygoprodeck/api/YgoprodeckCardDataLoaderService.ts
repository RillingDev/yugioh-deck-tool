import { inject, injectable } from "inversify";
import { YgoprodeckApiService } from "./YgoprodeckApiService";
import { YGOPRODECK_INTERNAL_TYPES } from "../types";
import type { CardSet, CardValues } from "@/core/lib";
import { FindCardBy } from "@/core/lib";
import type { UnlinkedCard } from "@/ygoprodeck/api/UnlinkedCard";

/**
 * Implementation of a service loading data using {@link YgoprodeckApiService}.
 * Can be used outside ygoprodeck.com.
 */
@injectable()
export class YgoprodeckCardDataLoaderService {
	readonly #ygoprodeckApiService: YgoprodeckApiService;

	constructor(
		@inject(YGOPRODECK_INTERNAL_TYPES.YgoprodeckApiService)
		ygoprodeckApiService: YgoprodeckApiService
	) {
		this.#ygoprodeckApiService = ygoprodeckApiService;
	}

	async getCard(
		cardKey: string,
		findCardBy: FindCardBy
	): Promise<UnlinkedCard | null> {
		if (findCardBy == FindCardBy.PASSCODE) {
			return this.#ygoprodeckApiService.getSingleCard({
				passcode: cardKey,
				includeAliased: true, // Include alternate artworks IDs as well.
			});
		} else {
			return this.#ygoprodeckApiService.getSingleCard({
				fuzzyName: cardKey, // fuzzy name matching, so we get the most similar match instead of an exact match.
				sorting: "relevance",
				includeAliased: false,
			});
		}
	}

	async getAllCards(): Promise<UnlinkedCard[]> {
		return this.#ygoprodeckApiService.getCards({
			includeAliased: true,
		});
	}

	async getAllCardSets(): Promise<CardSet[]> {
		return this.#ygoprodeckApiService.getCardSets();
	}

	async getCardValues(): Promise<CardValues> {
		return this.#ygoprodeckApiService.getCardValues();
	}

	async getArchetypes(): Promise<string[]> {
		return this.#ygoprodeckApiService.getArchetypes();
	}
}
