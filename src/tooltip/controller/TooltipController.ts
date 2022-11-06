import type { Card, CardDatabase } from "@/core/lib";
import { FindCardBy } from "@/core/lib";

export class TooltipController {
	readonly #cardDatabase: CardDatabase;

	constructor(cardDatabase: CardDatabase) {
		this.#cardDatabase = cardDatabase;
	}

	/**
	 * Loads a card based on its key.
	 *
	 * @param cardKey Key to load by (either name or ID).
	 * @return Card.
	 */
	async loadCard(cardKey: string): Promise<Card> {
		let resolvedCardKey = await this.#cardDatabase.prepareCard(
			cardKey,
			FindCardBy.NAME
		);
		if (
			resolvedCardKey != null &&
			this.#cardDatabase.hasCard(resolvedCardKey, FindCardBy.NAME)
		) {
			return this.#cardDatabase.getCard(
				resolvedCardKey,
				FindCardBy.NAME
			)!;
		}
		resolvedCardKey = await this.#cardDatabase.prepareCard(
			cardKey,
			FindCardBy.PASSCODE
		);
		if (
			resolvedCardKey != null &&
			this.#cardDatabase.hasCard(resolvedCardKey, FindCardBy.PASSCODE)
		) {
			return this.#cardDatabase.getCard(
				resolvedCardKey,
				FindCardBy.PASSCODE
			)!;
		}
		throw new Error(`Could not find card '${cardKey}'.`);
	}
}
