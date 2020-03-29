import { inject, injectable } from "inversify";
import { Deck } from "../../model/ygo/Deck";
import { TYPES } from "../../../types";
import { Card } from "../../model/ygo/Card";
import { DeckService } from "./DeckService";
import {
    DEFAULT_DECK_PART_ARR,
    DefaultDeckPart,
} from "../../model/ygo/DeckPart";
import { CardService } from "./CardService";
import { CardTypeGroup } from "../../model/ygo/CardTypeGroup";

@injectable()
class DeckExportService {
    private readonly deckService: DeckService;
    private readonly cardService: CardService;

    constructor(
        @inject(TYPES.DeckService)
        deckService: DeckService,
        @inject(TYPES.CardService)
        cardService: CardService
    ) {
        this.deckService = deckService;
        this.cardService = cardService;
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
     * @param deck Deck to create the text for.
     * @return Text form of the deck.
     */
    public toShareableText(deck: Deck): string {
        const result: string[] = [];
        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            const cards = deck.parts.get(deckPart)!;
            // Main deck cards also get split up by type group
            if (deckPart === DefaultDeckPart.MAIN) {
                for (const cardTypeGroup of Object.values(CardTypeGroup)) {
                    result.push(
                        ...this.createCardList(
                            cardTypeGroup,
                            cards.filter(
                                (card) => card.type.group === cardTypeGroup
                            )
                        )
                    );
                }
            } else {
                result.push(...this.createCardList(deckPart.name, cards));
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

        const counted: Map<Card, number> = this.cardService.countCards(cards);
        for (const [card, count] of counted.entries()) {
            result.push(`${card.name} x${count}`);
        }
        result.push("");
        return result;
    }

    /**
     * Creates a buy link of a deck for tcgplayer.com.
     *
     * @param deck Deck to create a link for.
     * @return Buy link.
     */
    public toBuyLink(deck: Deck): string {
        const counted: Map<Card, number> = this.cardService.countCards(
            this.deckService.getAllCards(deck)
        );
        const cardList = Array.from(counted.entries()).map(
            ([card, count]) => `${count} ${card.name}`
        );
        return (
            "https://store.tcgplayer.com/massentry?partner=YGOPRODeck&productline=Yugioh&c=" +
            encodeURIComponent(["", ...cardList, ""].join("||"))
        );
    }
}

export { DeckExportService };
