import "reflect-metadata";
import { DeckExportService } from "../../../../src/core/business/service/DeckExportService";
import { TYPES } from "../../../../src/types";
import { createCard } from "../../helper/dataFactories";
import {
    DeckPart,
    DefaultDeckPart,
} from "../../../../src/core/model/ygo/DeckPart";
import { Card } from "../../../../src/core/model/ygo/Card";
import { container } from "../../../../src/inversify.config";

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
            const card1 = createCard({ id: "123", name: "foo" });
            const card2 = createCard({ id: "456", name: "bar" });
            const card3 = createCard({ id: "789", name: "fizz" });

            const result = deckExportService.toShareableText({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card3, card1, card3]],
                ]),
            });
            expect(result).toEqual(
                `Main:
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
            const card1 = createCard({ id: "123", name: "foo" });
            const card2 = createCard({ id: "456", name: "bar" });
            const card3 = createCard({ id: "789", name: "fizz" });

            const result = deckExportService.toBuyLink({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card3, card1, card3]],
                ]),
            });
            expect(result).toEqual(
                "https://store.tcgplayer.com/massentry?partner=YGOPRODeck&productline=Yugioh" +
                    `&c=${encodeURIComponent("||2 foo||2 bar||3 fizz||")}`
            );
        });
    });
});
