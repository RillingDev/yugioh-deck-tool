import { inject, injectable } from "inversify";
import type { Deck } from "./Deck";
import { TYPES } from "../types";
import type { Card } from "../card/Card";
import { DeckService } from "./DeckService";
import { DefaultDeckPartConfig } from "./DeckPartConfig";
import { CardService } from "../card/CardService";
import { CardTypeCategory } from "../card/type/CardTypeCategory";
import { FilterService } from "../card/FilterService";
import { DECK_PART_ARR, DeckPart } from "./DeckPart";

@injectable()
class DeckExportService {
    readonly #deckService: DeckService;
    readonly #cardService: CardService;
    readonly #filterService: FilterService;

    constructor(
        @inject(TYPES.DeckService)
        deckService: DeckService,
        @inject(TYPES.CardService)
        cardService: CardService,
        @inject(TYPES.FilterService)
        filterService: FilterService
    ) {
        this.#deckService = deckService;
        this.#cardService = cardService;
        this.#filterService = filterService;
    }

    /**
     * Creates a shareable text in the following format for a deck:
     * <pre>
     * Monster:
     * 1x Foo
     * 3x Fizz
     *
     * Spell:
     * 3x Bar
     *
     * Side:
     * 1x Foo
     * </pre>
     *
     * @param deck Deck to create the text for.
     * @return Text form of the deck.
     */
    public toShareableText(deck: Deck): string {
        const result: string[] = [];
        for (const deckPart of DECK_PART_ARR) {
            const cards = deck.parts[deckPart];
            // Main deck cards also get split up by type category.
            if (deckPart === DeckPart.MAIN) {
                for (const typeCategory of Object.values(CardTypeCategory)) {
                    result.push(
                        ...this.createCardList(
                            typeCategory,
                            this.#filterService.filter(cards, {
                                typeCategory: typeCategory,
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
        result.push(...this.#cardService.createFormattedCardCountList(cards));
        result.push("");
        return result;
    }

    /**
     * Creates an affiliate buy link of a deck for tcgplayer.com.
     *
     * @see https://docs.tcgplayer.com/docs/mass-entry-and-affiliate-linking
     * @param deck Deck to create a link for.
     * @param affiliateMedium Tcgplayer.com affiliate code.
     * @param affiliateSource Tcgplayer.com affiliate source name.
     * @return Buy link.
     */
    public toBuyLink(
        deck: Deck,
        affiliateMedium: string,
        affiliateSource: string
    ): URL {
        const countedCards: Map<Card, number> = this.#cardService.countByCard(
            this.#deckService.getAllCards(deck)
        );
        const cardListUriParam =
            Array.from(countedCards.entries())
                .map(([card, count]) => `${count} ${card.name}`)
                .join("||") + "||";

        const buyLink = new URL("massentry", "https://www.tcgplayer.com");
        buyLink.searchParams.append("productline", "Yugioh");
        buyLink.searchParams.append("utm_campaign", "affiliate");
        buyLink.searchParams.append("utm_medium", affiliateMedium);
        buyLink.searchParams.append("utm_source", affiliateSource);
        buyLink.searchParams.append("c", cardListUriParam);
        return buyLink;
    }
}

export { DeckExportService };
