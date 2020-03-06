import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardType } from "../model/CardType";

export interface CardDatabase {
    /**
     * Initializes the database.
     * Consumer has to ensure this is only called once.
     */
    init(): Promise<void>;

    isReady(): boolean;

    hasCard(cardId: string): boolean;

    getCard(cardId: string): Card | null;

    getCards(): Card[];

    getSets(): CardSet[];

    getTypes(): CardType[];

    getSkillRaces(): string[];

    getSpellRaces(): string[];

    getTrapRaces(): string[];

    getMonsterRaces(): string[];

    getMonsterAttributes(): string[];

    getMonsterLevels(): number[];

    getMonsterLinkMarkers(): string[];
}
