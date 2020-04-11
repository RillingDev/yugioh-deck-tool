import { CardSet } from "../../model/ygo/CardSet";
import { CardValues } from "../../model/ygo/CardValues";
import { UnlinkedCard } from "../../model/ygo/intermediate/UnlinkedCard";

/**
 * Interface for a service loading card data, like available cards or sets.
 */
interface CardDataLoaderService {
    /**
     * Get all available cards. Note that this may be several thousands.
     * Before working with the result, a conversion to {@link Card}s should be made.
     */
    getAllCards(): Promise<UnlinkedCard[]>;

    /**
     * Get all available sets. Note that this may be several hundreds.
     */
    getAllCardSets(): Promise<CardSet[]>;

    /**
     * Get card values, containing possible card types, races or other generic values which apply to the game as a whole.
     */
    getCardValues(): Promise<CardValues>;

    /**
     * Get archetypes which exist, which can be compared against a cards archetype.
     */
    getArchetypes(): Promise<string[]>;
}

export { CardDataLoaderService };
