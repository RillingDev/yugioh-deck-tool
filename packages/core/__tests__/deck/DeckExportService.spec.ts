import "reflect-metadata";

import { createCard, createCardType } from "../helper/dataFactories";
import { Container } from "inversify";
import type { DeckExportService } from "../../src/deck/DeckExportService";
import { baseModule, deckModule } from "../../src/inversify.modules";
import { TYPES } from "../../src/types";
import { CardTypeCategory } from "../../src/card/type/CardTypeCategory";
import { DeckPart } from "../../src/deck/DeckPart";
import type { CardDataLoaderService } from "../../src/card/CardDataLoaderService";
import { MockDataLoaderService } from "../helper/MockDataLoaderService";

describe("DeckExportService", () => {
    let deckExportService: DeckExportService;

    beforeEach(() => {
        const container = new Container();
        container.load(baseModule, deckModule);
        container
            .bind<CardDataLoaderService>(TYPES.CardDataLoaderService)
            .to(MockDataLoaderService);

        deckExportService = container.get<DeckExportService>(
            TYPES.DeckExportService
        );
    });

    describe("toShareableText", () => {
        it("creates text", () => {
            const card1 = createCard({
                passcode: "123",
                name: "foo",
                type: createCardType({ group: CardTypeCategory.SPELL }),
            });
            const card2 = createCard({
                passcode: "321",
                name: "foo ooo",
                type: createCardType({ group: CardTypeCategory.MONSTER }),
            });
            const card3 = createCard({ passcode: "456", name: "bar" });
            const card4 = createCard({ passcode: "789", name: "fizz" });

            const result = deckExportService.toShareableText({
                name: null,
                parts: {
                    [DeckPart.MAIN]: [card1, card2, card2],
                    [DeckPart.EXTRA]: [card3, card3],
                    [DeckPart.SIDE]: [card4, card4, card1, card4],
                },
            });
            expect(result).toEqual(`Monster:
2x foo ooo

Spell:
1x foo

Extra:
2x bar

Side:
3x fizz
1x foo
`);
        });
    });

    describe("toBuyLink", () => {
        it("creates text", () => {
            const card1 = createCard({ passcode: "123", name: "foo" });
            const card2 = createCard({ passcode: "456", name: "bar" });
            const card3 = createCard({ passcode: "789", name: "fizz" });

            const result = deckExportService.toBuyLink(
                {
                    name: null,
                    parts: {
                        [DeckPart.MAIN]: [card1],
                        [DeckPart.EXTRA]: [card2, card2],
                        [DeckPart.SIDE]: [card3, card3, card1, card3],
                    },
                },
                "deck-builder",
                "YGOPRODeck"
            );

            const expected = new URL("https://www.tcgplayer.com/massentry");
            expected.searchParams.append("productline", "Yugioh");
            expected.searchParams.append("utm_campaign", "affiliate");
            expected.searchParams.append("utm_medium", "deck-builder");
            expected.searchParams.append("utm_source", "YGOPRODeck");
            expected.searchParams.append("c", "2 foo||2 bar||3 fizz||");

            expect(result).toEqual(expected);
        });
    });
});
