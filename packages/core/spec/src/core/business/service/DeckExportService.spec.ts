import "reflect-metadata";
import { DeckExportService } from "../../../../../src/core/business/service/DeckExportService";
import { TYPES } from "../../../../../src/types";
import { createCard, createCardType } from "../../../helper/dataFactories";
import {
    DeckPartConfig,
    DefaultDeckPartConfig,
} from "../../../../../src/core/model/ygo/DeckPartConfig";
import { Card } from "../../../../../src/core/model/ygo/Card";
import { container } from "../../../../../src/inversify.config";
import { CardTypeGroup } from "../../../../../src/core/model/ygo/CardTypeGroup";
import { DeckPart } from "../../../../../src/core/model/ygo/DeckPart";

describe("DeckExportService", () => {
    let deckExportService: DeckExportService;

    beforeEach(() => {
        container.snapshot();

        deckExportService = container.get<DeckExportService>(
            TYPES.DeckExportService
        );
    });

    afterEach(() => {
        container.restore();
    });

    describe("toShareableText", () => {
        it("creates text", () => {
            const card1 = createCard({
                passcode: "123",
                name: "foo",
                type: createCardType({ group: CardTypeGroup.SPELL }),
            });
            const card2 = createCard({
                passcode: "321",
                name: "foo ooo",
                type: createCardType({ group: CardTypeGroup.MONSTER }),
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
            expect(result).toEqual(
                `Monster:
foo ooo x2

Spell:
foo x1

Extra:
bar x2

Side:
fizz x3
foo x1
`
            );
        });
    });

    describe("toBuyLink", () => {
        it("creates text", () => {
            const card1 = createCard({ passcode: "123", name: "foo" });
            const card2 = createCard({ passcode: "456", name: "bar" });
            const card3 = createCard({ passcode: "789", name: "fizz" });

            const result = deckExportService.toBuyLink({
                name: null,
                parts: {
                    [DeckPart.MAIN]: [card1],
                    [DeckPart.EXTRA]: [card2, card2],
                    [DeckPart.SIDE]: [card3, card3, card1, card3],
                },
            });

            const expected = new URL(
                "massentry",
                "https://store.tcgplayer.com"
            );
            expected.searchParams.append("utm_campaign", "affiliate");
            expected.searchParams.append("utm_medium", "deck-builder");
            expected.searchParams.append("utm_source", "YGOPRODeck");
            expected.searchParams.append("productline", "Yugioh");
            expected.searchParams.append("c", "2 foo||2 bar||3 fizz||");

            expect(result).toEqual(expected.toString());
        });
    });
});
