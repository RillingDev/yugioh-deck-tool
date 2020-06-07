import { inject, injectable } from "inversify";
import { DefaultDeckPartConfig } from "../../model/ygo/DeckPartConfig";
import { Card } from "../../model/ygo/Card";
import { Deck } from "../../model/ygo/Deck";
import { TYPES } from "../../../types";
import { CardService } from "./CardService";
import { Format } from "../../model/ygo/Format";
import { insertAt, pullFirst } from "lightdash";
import { pullAt, sampleSize, shuffle } from "lodash";
import { SortingService, SortingStrategy } from "./SortingService";
import { CardTypeGroup } from "../../model/ygo/CardTypeGroup";
import { BanlistService } from "./BanlistService";
import { DECK_PART_ARR, DeckPart } from "../../model/ygo/DeckPart";

/**
 * @public
 */
@injectable()
class DeckService {
    private readonly cardService: CardService;
    private readonly sortingService: SortingService;
    private readonly banlistService: BanlistService;

    constructor(
        @inject(TYPES.CardService) cardService: CardService,
        @inject(TYPES.SortingService) sortingService: SortingService,
        @inject(TYPES.BanlistService) banlistService: BanlistService
    ) {
        this.cardService = cardService;
        this.sortingService = sortingService;
        this.banlistService = banlistService;
    }

    /**
     * Checks if a given card can be moved in the deck.
     * Similar to {@link #canAdd}, with the difference that in this case
     * the check is done against a copy of the deck with the card removed in order to correctly test the card count.
     *
     * @param deck Deck to check.
     * @param oldDeckPart Deck part to card is moved from.
     * @param newDeckPart Deck part to card is moved to.
     * @param format Format to check for, may be null for none.
     * @param card Card to check.
     * @return if the card can be moved for these parameters.
     */
    public canMove(
        deck: Deck,
        oldDeckPart: DeckPart,
        newDeckPart: DeckPart,
        format: Format | null,
        card: Card
    ): boolean {
        const deckWithoutCard = this.cloneDeck(deck);
        this.removeCard(deckWithoutCard, oldDeckPart, card);

        return this.canAdd(deckWithoutCard, newDeckPart, format, card);
    }

    /**
     * Checks if a given card can be added to the deck.
     * Checks done include deck size check, banlist check, max count of card check
     * and special handling for certain card types (e.g. skill cards)
     *
     * @param deck Deck to check addition for.
     * @param deckPart Deck part to check addition for.
     * @param format Format to check for, may be null for none.
     * @param card Card to check.
     * @return if the card can be added for these parameters.
     */
    public canAdd(
        deck: Deck,
        deckPart: DeckPart,
        format: Format | null,
        card: Card
    ): boolean {
        // If the card is not allowed in this deck part, return false
        if (!card.type.deckParts.has(deckPart)) {
            return false;
        }

        // If adding would make the deck part be larger than allowed, return false
        const deckPartSize = deck.parts[deckPart].length;
        if (deckPartSize + 1 > DefaultDeckPartConfig[deckPart].max) {
            return false;
        }

        // If a skill card would be added with one already existing, return false
        if (
            card.type.group === CardTypeGroup.SKILL &&
            this.getAllCards(deck).some(
                (existingCard) =>
                    existingCard.type.group === CardTypeGroup.SKILL
            )
        ) {
            return false;
        }

        // If adding this card would make the total count of this card in this deck
        // be larger than allowed by the banlist, return false
        const count = this.getAllCards(deck).filter((existingCard) =>
            this.cardService.isTreatedAsSame(existingCard, card)
        ).length;
        const banState = this.banlistService.getBanStateByFormat(card, format);
        return count < banState.count;
    }

    /**
     * Adds a card.
     * Make sure to use {@link #canAdd} before.
     *
     * @param deck Deck to add to.
     * @param deckPart Deck part to add to.
     * @param card Card to add.
     * @param newIndex Optional index to add the card at.
     */
    public addCard(
        deck: Deck,
        deckPart: DeckPart,
        card: Card,
        newIndex?: number
    ): void {
        const current = deck.parts[deckPart];
        if (newIndex != null) {
            insertAt(current, newIndex, card);
        } else {
            current.push(card);
        }
    }

    /**
     * Removes a card. if the card cannot be found, nothing will be done.
     *
     * @param deck Deck to remove from.
     * @param deckPart Deck part to remove from.
     * @param card Card to remove.
     * @param oldIndex Optional index to remove the card at.
     */
    public removeCard(
        deck: Deck,
        deckPart: DeckPart,
        card: Card,
        oldIndex?: number
    ): void {
        const cards = deck.parts[deckPart];
        if (oldIndex != null) {
            if (cards[oldIndex] === card) {
                pullAt(cards, oldIndex);
            }
        } else {
            pullFirst(cards, card);
        }
    }

    /**
     * Move a card in its deck-part.
     *
     * @param deck Deck to use.
     * @param deckPart Deck part to move in.
     * @param card Card to move.
     * @param oldIndex Index to move card from.
     * @param newIndex Index to move card to.
     */
    public reorderCard(
        deck: Deck,
        deckPart: DeckPart,
        card: Card,
        oldIndex: number,
        newIndex: number
    ): void {
        const cards = deck.parts[deckPart];
        if (cards[oldIndex] === card) {
            pullAt(cards, oldIndex);
            insertAt(cards, newIndex, card);
        }
    }

    /**
     * Returns a sorted copy of the deck.
     *
     * @param deck Deck to sort.
     * @return Sorted copy.
     */
    public sort(deck: Deck): Deck {
        const deckClone = this.cloneDeck(deck);
        for (const deckPart of DECK_PART_ARR) {
            deckClone.parts[deckPart] = this.sortingService.sort(
                deckClone.parts[deckPart],
                {
                    strategy: SortingStrategy.DECK,
                }
            );
        }
        return deckClone;
    }

    /**
     * Returns a shuffled copy of the deck.
     *
     * @param deck Deck to shuffle.
     * @return Shuffled copy.
     */
    public shuffle(deck: Deck): Deck {
        const deckClone = this.cloneDeck(deck);
        for (const deckPart of DECK_PART_ARR) {
            deckClone.parts[deckPart] = shuffle(deckClone.parts[deckPart]);
        }
        return deckClone;
    }

    /**
     * Simulates a starting hand.
     *
     * @param deck Deck to simulate for.
     * @param goingFirst If the simulation should be for a player going first (instead of going second).
     * @return The simulated starting hand cards.
     */
    public getSimulatedStartingHand(deck: Deck, goingFirst: boolean): Card[] {
        return sampleSize(deck.parts[DeckPart.MAIN], goingFirst ? 5 : 6);
    }

    /**
     * Gets a list of all cards of all parts.
     *
     * @param deck Deck to get cards for.
     * @return All cards of the deck.
     */
    public getAllCards(deck: Deck): Card[] {
        const result = [];
        for (const deckPart of DECK_PART_ARR) {
            result.push(...deck.parts[deckPart]);
        }
        return result;
    }

    /**
     * Creates a new empty deck.
     *
     * @return Created deck.
     */
    public createEmptyDeck(): Deck {
        return {
            name: null,
            parts: {
                [DeckPart.MAIN]: [],
                [DeckPart.EXTRA]: [],
                [DeckPart.SIDE]: [],
            },
        };
    }

    private cloneDeck(deck: Deck): Deck {
        // Manual copy to avoid accidentally creating new cards.
        return {
            name: deck.name,
            parts: {
                [DeckPart.MAIN]: Array.from(deck.parts[DeckPart.MAIN]),
                [DeckPart.EXTRA]: Array.from(deck.parts[DeckPart.EXTRA]),
                [DeckPart.SIDE]: Array.from(deck.parts[DeckPart.SIDE]),
            },
        };
    }
}

export { DeckService };
