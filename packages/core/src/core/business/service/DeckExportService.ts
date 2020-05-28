import { inject, injectable } from "inversify";
import { Deck } from "../../model/ygo/Deck";
import { TYPES } from "../../../types";
import { Card } from "../../model/ygo/Card";
import { DeckService } from "./DeckService";
import { DefaultDeckPartConfig } from "../../model/ygo/DeckPartConfig";
import { CardService } from "./CardService";
import { CardTypeGroup } from "../../model/ygo/CardTypeGroup";
import { FilterService } from "./FilterService";
import { DECK_PART_ARR, DeckPart } from "../../model/ygo/DeckPart";

/**
 * @public
 */
@injectable()
class DeckExportService {
    private readonly deckService: DeckService;
    private readonly cardService: CardService;
    private readonly filterService: FilterService;

    constructor(
        @inject(TYPES.DeckService)
        deckService: DeckService,
        @inject(TYPES.CardService)
        cardService: CardService,
        @inject(TYPES.FilterService)
        filterService: FilterService
    ) {
        this.deckService = deckService;
        this.cardService = cardService;
        this.filterService = filterService;
    }

    /**
     * Creates a shareable text in the following format for a deck:
     * <pre>
     * Monster:
     * Foo x1
     * Fizz x3
     *
     * Spell:
     * Bar x3
     *
     * Side:
     * Foo x1
     * </pre>
     *
     * @param deck Deck to create the text for.
     * @return Text form of the deck.
     */
    public toShareableText(deck: Deck): string {
        const result: string[] = [];
        for (const deckPart of DECK_PART_ARR) {
            const cards = deck.parts[deckPart];
            // Main deck cards also get split up by type group
            if (deckPart === DeckPart.MAIN) {
                for (const cardTypeGroup of Object.values(CardTypeGroup)) {
                    result.push(
                        ...this.createCardList(
                            cardTypeGroup,
                            this.filterService.filter(cards, {
                                typeGroup: cardTypeGroup,
                            })
                        )
                    );
                }
            } else {
                result.push(
                    ...this.createCardList(
                        DefaultDeckPartConfig[deckPart].name,
                        cards
                    )
                );
            }
        }
        return result.join("\n");
    }

    private createCardList(sectionName: string, cards: Card[]): string[] {
        if (cards.length === 0) {
            return [];
        }
        const result: string[] = [];
        result.push(`${sectionName}:`);
        result.push(...this.cardService.createCountedCardList(cards));
        result.push("");
        return result;
    }

    /**
     * Creates a buy link of a deck for tcgplayer.com.
     *
     * @see https://docs.tcgplayer.com/docs/mass-entry-and-affiliate-linking
     * @param deck Deck to create a link for.
     * @return Buy link.
     */
    public toBuyLink(deck: Deck): string {
        const countedCards: Map<Card, number> = this.cardService.countCards(
            this.deckService.getAllCards(deck)
        );
        const cardListUriParam =
            Array.from(countedCards.entries())
                .map(([card, count]) => `${count} ${card.name}`)
                .join("||") + "||";

        const buyLink = new URL("massentry", "https://store.tcgplayer.com");
        buyLink.searchParams.append("utm_campaign", "affiliate");
        buyLink.searchParams.append("utm_medium", "deck-builder");
        buyLink.searchParams.append("utm_source", "YGOPRODeck");
        buyLink.searchParams.append("productline", "Yugioh");
        buyLink.searchParams.append("c", cardListUriParam);
        return buyLink.toString();
    }
}

export { DeckExportService };
