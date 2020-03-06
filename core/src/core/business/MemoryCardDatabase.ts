import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CardDataLoaderService, UnlinkedCard } from "./CardDataLoaderService";
import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
import { CardDatabase } from "./CardDatabase";
import { CardType } from "../model/CardType";
import { CardTypeGroup } from "../model/CardTypeGroup";
import { MonsterGroupValues } from "../model/MonsterGroupValues";
import { GroupValues } from "../model/GroupValues";
import { CardValues } from "../model/CardValues";
import { CardSetAppearance } from "../model/CardSetAppearance";

@injectable()
class MemoryCardDatabase implements CardDatabase {
    private readonly dataLoaderClient: CardDataLoaderService;
    private readonly ready: boolean;
    private readonly cards: Map<string, Card>;
    private readonly sets: CardSet[];
    private readonly monsterValues: MonsterGroupValues;
    private readonly spellValues: GroupValues;
    private readonly trapValues: GroupValues;
    private readonly skillValues: GroupValues;
    private readonly types: CardType[];

    constructor(
        @inject(TYPES.CardDataLoaderService)
        dataLoaderClient: CardDataLoaderService
    ) {
        this.dataLoaderClient = dataLoaderClient;
        this.cards = new Map<string, Card>();
        this.sets = [];
        this.types = [];
        this.spellValues = {
            races: []
        };
        this.trapValues = {
            races: []
        };
        this.skillValues = {
            races: []
        };
        this.monsterValues = {
            races: [],
            attributes: [],
            linkmarkers: [],
            levels: []
        };
        this.ready = false;
    }

    public async init(): Promise<void> {
        const [cardInfo, cardSets, cardValues] = await Promise.all([
            this.dataLoaderClient.getCardInfo(),
            this.dataLoaderClient.getCardSets(),
            this.dataLoaderClient.getCardValues()
        ]);

        this.sets.push(...cardSets);

        this.types.push(...cardValues.types);

        const monsterGroupValues = cardValues.values[CardTypeGroup.MONSTER];
        this.monsterValues.races = monsterGroupValues.races;
        this.monsterValues.attributes = monsterGroupValues.attributes;
        this.monsterValues.levels = monsterGroupValues.levels;
        this.monsterValues.linkmarkers = monsterGroupValues.linkmarkers;

        const spellGroupValues = cardValues.values[CardTypeGroup.SPELL];
        this.spellValues.races = spellGroupValues.races;

        const trapGroupValues = cardValues.values[CardTypeGroup.TRAP];
        this.trapValues.races = trapGroupValues.races;

        const skillGroupValues = cardValues.values[CardTypeGroup.SKILL];
        this.skillValues.races = skillGroupValues.races;

        for (const unlinkedCard of cardInfo) {
            this.cards.set(
                unlinkedCard.id,
                this.createLinkedCard(unlinkedCard, cardSets, cardValues)
            );
        }
    }

    public isReady(): boolean {
        return this.ready;
    }

    public hasCard(cardId: string): boolean {
        return this.cards.has(cardId);
    }

    public getCard(cardId: string): Card | null {
        return this.cards.get(cardId) ?? null;
    }

    public getCards(): Card[] {
        return Array.from(this.cards.values());
    }

    public getSets(): CardSet[] {
        return Array.from(this.sets);
    }

    public getTypes(): CardType[] {
        return Array.from(this.types.values());
    }

    public getSkillRaces(): string[] {
        return Array.from(this.skillValues.races);
    }

    public getSpellRaces(): string[] {
        return Array.from(this.spellValues.races);
    }

    public getTrapRaces(): string[] {
        return Array.from(this.trapValues.races);
    }

    public getMonsterRaces(): string[] {
        return Array.from(this.monsterValues.races);
    }

    public getMonsterAttributes(): string[] {
        return Array.from(this.monsterValues.attributes);
    }

    public getMonsterLevels(): number[] {
        return Array.from(this.monsterValues.levels);
    }

    public getMonsterLinkMarkers(): string[] {
        return Array.from(this.monsterValues.linkmarkers);
    }

    private createLinkedCard(
        unlinkedCard: UnlinkedCard,
        cardSets: CardSet[],
        cardValues: CardValues
    ): Card {
        return {
            id: unlinkedCard.id,
            name: unlinkedCard.name,
            desc: unlinkedCard.desc,
            type: this.linkType(unlinkedCard.type, cardValues.types),

            race: unlinkedCard.race,
            attribute: unlinkedCard.attribute,
            atk: unlinkedCard.atk,
            def: unlinkedCard.def,
            level: unlinkedCard.level,
            scale: unlinkedCard.scale,
            linkval: unlinkedCard.linkval,
            linkmarkers: unlinkedCard.linkmarkers,

            sets: this.linkSets(unlinkedCard.sets, cardSets),
            image: unlinkedCard.image,
            prices: unlinkedCard.prices,
            betaName: unlinkedCard.betaName,
            treatedAs: unlinkedCard.treatedAs,
            archetype: unlinkedCard.archetype,

            formats: unlinkedCard.formats,
            release: unlinkedCard.release,
            banlist: unlinkedCard.banlist,

            views: unlinkedCard.views
        };
    }

    private linkSets(
        setAppearances: CardSetAppearance[],
        cardSets: CardSet[]
    ): CardSet[] {
        return setAppearances.map(setAppearance => {
            const matchingType = cardSets.find(
                set => set.name === setAppearance.name
            );
            if (matchingType == null) {
                throw new TypeError(`Could not find set '${setAppearance}'.`);
            }
            return matchingType;
        });
    }

    private linkType(typeName: string, types: CardType[]): CardType {
        const matchingType = types.find(type => type.name === typeName);
        if (matchingType == null) {
            throw new TypeError(`Could not find type '${typeName}'.`);
        }
        return matchingType;
    }
}

export { MemoryCardDatabase };
