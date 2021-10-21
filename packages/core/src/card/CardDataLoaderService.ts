import type { CardSet } from "./set/CardSet";
import type { CardValues } from "./type/CardValues";
import type { UnlinkedCard } from "./UnlinkedCard";
import type { FindCardBy } from "./CardDatabase";

/**
 * Interface for a service loading card data, like available cards or sets.
 */
export interface CardDataLoaderService {
	/**
	 * Gets a card by its exact name OR passcode. Return null if none is found.
	 */
	getCard: (
		cardKey: string,
		findCardBy: FindCardBy
	) => Promise<UnlinkedCard | null>;

	/**
	 * Get all available cards. Note that this may be several thousands.
	 * Before working with the result, a conversion to {@link Card}s should be made.
	 */
	getAllCards: () => Promise<UnlinkedCard[]>;

	/**
	 * Get all available sets. Note that this may be several hundreds.
	 */
	getAllCardSets: () => Promise<CardSet[]>;

	/**
	 * Get card values, containing possible card types, sub-types or other generic values which apply to the game as a whole.
	 */
	getCardValues: () => Promise<CardValues>;

	/**
	 * Get archetypes which exist, which can be compared against a cards archetype.
	 */
	getArchetypes: () => Promise<string[]>;
}
