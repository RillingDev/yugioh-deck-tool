import { Card } from "../model/ygo/Card";
import { CardSet } from "../model/ygo/CardSet";
import { CardType } from "../model/ygo/CardType";
import { CardTypeGroup } from "../model/ygo/CardTypeGroup";

enum FindCardBy {
    NAME,
    ID,
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

    getTypes(cardTypeGroup: CardTypeGroup): CardType[];

    getRaces(cardTypeGroup: CardTypeGroup): string[];

    getMonsterAttributes(): string[];

    getMonsterLevels(): number[];

    getMonsterLinkMarkers(): string[];
}
export { FindCardBy, CardDatabase };
