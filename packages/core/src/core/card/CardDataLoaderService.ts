import { CardSet } from "./set/CardSet";
import { CardValues } from "./type/CardValues";
import { UnlinkedCard } from "./UnlinkedCard";
import { FindCardBy } from "./CardDatabase";
import { Card } from "./Card";

/**
 * Interface for a service loading card data, like available cards or sets.
 */
interface CardDataLoaderService {
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

    /**
     * Sends a request to increase the view count of the card by one.
     */
    updateViews: (card: Card) => Promise<void>;
}

export { CardDataLoaderService };
