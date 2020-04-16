import { inject, injectable } from "inversify";
import { DeckPart, DEFAULT_DECK_PART_ARR } from "../../model/ygo/DeckPart";
import { Card } from "../../model/ygo/Card";
import { Deck } from "../../model/ygo/Deck";
import { TYPES } from "../../../types";
import { CardService } from "./CardService";
import { Format } from "../../model/ygo/Format";
import { removeItem } from "lightdash";
import { shuffle } from "lodash";
import { SortingService, SortingStrategy } from "./SortingService";
import { CardTypeGroup } from "../../model/ygo/CardTypeGroup";

/**
 * @public
 */
@injectable()
class DeckService {
    private readonly cardService: CardService;
    private readonly sortingService: SortingService;

    constructor(
        @inject(TYPES.CardService) cardService: CardService,
        @inject(TYPES.SortingService) sortingService: SortingService
    ) {
        this.cardService = cardService;
        this.sortingService = sortingService;
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
        // If the card is not allowed in this deckpart, return false
        if (!card.type.deckParts.has(deckPart)) {
            return false;
        }

        // If adding would make the deckpart be larger than allowed, return false
        const deckPartSize = deck.parts.get(deckPart)!.length;
        if (deckPartSize + 1 > deckPart.max) {
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
        const banState = this.cardService.getBanStateByFormat(card, format);
        return count < banState.count;
    }

    /**
     * Returns a copy of the deck with the card added.
     * Make sure to use {@link #canAdd} before.
     *
     * @param deck Deck to add to.
     * @param deckPart Deck part to add to.
     * @param card Card to add.
     * @return Copy of the deck with the card added.
     */
    public addCard(deck: Deck, deckPart: DeckPart, card: Card): Deck {
        const deckClone = this.cloneDeck(deck);
        deckClone.parts.get(deckPart)!.push(card);
        return deckClone;
    }

    /**
     * Returns a copy of the deck with the card removed. if the card cannot be found, nothing will be done.
     *
     * @param deck Deck to remove from.
     * @param deckPart Deck part to remove from.
     * @param card Card to remove.
     * @return Copy of the deck with the card removed.
     */
    public removeCard(deck: Deck, deckPart: DeckPart, card: Card): Deck {
        const deckClone = this.cloneDeck(deck);
        deckClone.parts.set(
            deckPart,
            Array.from(removeItem<Card>(deck.parts.get(deckPart)!, card, false))
        );
        return deckClone;
    }

    /**
     * Returns a sorted copy of the deck.
     *
     * @param deck Deck to sort.
     * @return Sorted copy.
     */
    public sort(deck: Deck): Deck {
        const deckClone = this.cloneDeck(deck);
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            deckClone.parts.set(
                deckPart,
                this.sortingService.sort(
                    deckClone.parts.get(deckPart)!,
                    SortingStrategy.DECK
                )
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
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            deckClone.parts.set(
                deckPart,
                shuffle(deckClone.parts.get(deckPart))
            );
        }
        return deckClone;
    }

    /**
     * Gets a list of all cards of all parts.
     *
     * @param deck Deck to get cards for.
     * @return All cards of the deck.
     */
    public getAllCards(deck: Deck): Card[] {
        const result = [];
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            result.push(...deck.parts.get(deckPart)!);
        }
        return result;
    }

    /**
     * Creates a new empty deck.
     *
     * @return Created deck.
     */
    public createEmptyDeck(): Deck {
        const parts = new Map<DeckPart, Card[]>();
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            parts.set(deckPart, []);
        }
        return { name: null, parts };
    }

    private cloneDeck(deck: Deck): Deck {
        const deckClone = {
            name: deck.name,
            parts: new Map<DeckPart, Card[]>(deck.parts),
        };
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            deckClone.parts.set(
                deckPart,
                Array.from(deckClone.parts.get(deckPart)!)
            );
        }
        return deckClone;
    }
}

export { DeckService };
