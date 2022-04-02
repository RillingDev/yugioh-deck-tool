import { inject, injectable } from "inversify";
import { YGOPRODECK_INTERNAL_TYPES } from "../types";
import type { Credentials } from "./YgoprodeckApiService";
import { YgoprodeckApiService } from "./YgoprodeckApiService";
import type { Card, CardCountFunction, UnlinkedCard } from "@/core/lib";
import { Environment, EnvironmentConfig, TYPES } from "@/core/lib";
import { toMapBy } from "lightdash";

@injectable()
export class YgoprodeckService {
	readonly #ygoprodeckApiService: YgoprodeckApiService;
	readonly #environmentConfig: EnvironmentConfig;

	constructor(
		@inject(YGOPRODECK_INTERNAL_TYPES.YgoprodeckApiService)
		ygoprodeckApiService: YgoprodeckApiService,
		@inject(TYPES.EnvironmentConfig)
		environmentConfig: EnvironmentConfig
	) {
		this.#ygoprodeckApiService = ygoprodeckApiService;
		this.#environmentConfig = environmentConfig;
	}

	/**
	 * Sends an event that a card has been viewed.
	 *
	 * @param card Card that was viewed.
	 */
	async increaseCardViewCount(card: Card): Promise<void> {
		this.validateEnv();
		return this.#ygoprodeckApiService.updateViews(card);
	}

	async getCollectionCardCountFunction(
		credentials: Credentials
	): Promise<CardCountFunction> {
		this.validateEnv();
		const unlinkedCards = await this.#ygoprodeckApiService.getCards({
			format: null,
			includeAliased: true,
			auth: credentials,
		});
		return this.#createCardCountFunction(
			toMapBy(
				unlinkedCards,
				(_key, unlinkedCard) => unlinkedCard.passcode,
				(_key, unlinkedCard) => unlinkedCard.quantity!
			)
		);
	}

	#createCardCountFunction(
		countedByPasscode: Map<string, number>
	): CardCountFunction {
		return (card: Card) =>
			countedByPasscode.has(card.passcode)
				? countedByPasscode.get(card.passcode)!
				: 0;
	}

	validateEnv(): void {
		if (
			this.#environmentConfig.getEnvironment() != Environment.YGOPRODECK
		) {
			throw new Error("Only available in YGOPRODECK environment.");
		}
	}
}
