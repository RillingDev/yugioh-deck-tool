import { Card } from "./Card";
import { CardSet } from "./set/CardSet";
import { CardType } from "./type/CardType";
import { CardTypeCategory } from "./type/CardTypeCategory";

enum FindCardBy {
    NAME,
    PASSCODE,
}

/**
 * @public
 */
interface CardDatabase {
    /**
     * Fully fills the database.
     */
    prepareAll(): Promise<void>;

    /**
     * Partially fills the database, loading a single card and direct dependencies.
     * Note that some fuzzy matching can be done, in which case the closest match will be used.
     *
     * @return The resolved version of the card key to be used for further lookups.
     */
    prepareCard(
        cardKey: string,
        findCardBy: FindCardBy
    ): Promise<string | null>;

    hasCard(cardKey: string, findCardBy: FindCardBy): boolean;

    getCard(cardKey: string, findCardBy: FindCardBy): Card | null;

    getCards(): Card[];

    getSets(): CardSet[];

    getArchetypes(): string[];

    getTypes(typeCategory: CardTypeCategory): CardType[];

    getSubTypes(typeCategory: CardTypeCategory): string[];

    getAttributes(): string[];

    getLevels(): number[];

    getLinkMarkers(): string[];
}

export { FindCardBy, CardDatabase };
