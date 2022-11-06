import type { Credentials, YgoprodeckApiService } from "./YgoprodeckApiService";
import type { Card, CardCountFunction, EnvironmentConfig } from "@/core/lib";
import { Environment } from "@/core/lib";
import { toMapBy } from "lightdash";

export class YgoprodeckService {
	readonly #ygoprodeckApiService: YgoprodeckApiService;
	readonly #environmentConfig: EnvironmentConfig;

	constructor(
		ygoprodeckApiService: YgoprodeckApiService,
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
