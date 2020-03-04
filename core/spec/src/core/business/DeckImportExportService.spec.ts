import "reflect-metadata";
import { container } from "../../../../src/inversify.config";
import { DeckImportExportService } from "../../../../src/core/business/DeckImportExportService";
import { TYPES } from "../../../../src/types";
import { CardDatabase } from "../../../../src/core/business/CardDatabase";
import { MockCardDatabase } from "../../helper/MockCardDatabase";
import { createCard } from "../../helper/dataFactories";
import {
    DECKPART_EXTRA,
    DECKPART_MAIN,
    DECKPART_SIDE
} from "../../../../src/core/data/DeckParts";

describe("DeckImportExportService", () => {
    let deckImportExportService: DeckImportExportService;
    let mockCardDatabase: MockCardDatabase;

    beforeEach(() => {
        container
            .rebind<CardDatabase>(TYPES.CardDatabase)
            .to(MockCardDatabase)
            .inSingletonScope();
        mockCardDatabase = container.get<MockCardDatabase>(TYPES.CardDatabase);
        deckImportExportService = container.get<DeckImportExportService>(
            TYPES.DeckImportExportService
        );
    });

    describe("fromFile", () => {
        it("processes filename", () => {
            expect(
                deckImportExportService.fromFile("", "foo.ydk").deck.name
            ).toBe("foo");
        });

        it("puts missing", () => {
            const fileContent = `
#main
123`;
            const result = deckImportExportService.fromFile(
                fileContent,
                "foo.ydk"
            );
            expect(result.missing.length).toBe(1);
            expect(result.missing).toContain("123");
        });

        it("puts card", () => {
            const fileContent = `
#main
123`;
            const card = createCard("123");
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile(
                fileContent,
                "foo.ydk"
            );
            expect(result.deck.parts.get(DECKPART_MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_MAIN)).toContain(card);
        });

        it("puts multiple", () => {
            const fileContent = `
#main
123
123
123`;
            const card = createCard("123");
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile(
                fileContent,
                "foo.ydk"
            );
            expect(result.deck.parts.get(DECKPART_MAIN)!.length).toBe(3);
            expect(result.deck.parts.get(DECKPART_MAIN)).toEqual([
                card,
                card,
                card
            ]);
        });

        it("puts per deckpart", () => {
            const fileContent = `
#main
123

#extra
456

!side
789`;
            const card1 = createCard("123");
            mockCardDatabase.registerCard("123", card1);
            const card2 = createCard("456");
            mockCardDatabase.registerCard("456", card2);
            const card3 = createCard("789");
            mockCardDatabase.registerCard("789", card3);

            const result = deckImportExportService.fromFile(
                fileContent,
                "foo.ydk"
            );
            expect(result.deck.parts.get(DECKPART_MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_MAIN)).toContain(card1);
            expect(result.deck.parts.get(DECKPART_EXTRA)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_EXTRA)).toContain(card2);
            expect(result.deck.parts.get(DECKPART_SIDE)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_SIDE)).toContain(card3);
        });

        it("ignores optional creator note", () => {
            const fileContent = `
#created by ...
#main
123`;
            const card = createCard("123");
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile(
                fileContent,
                "foo.ydk"
            );
            expect(result.deck.parts.get(DECKPART_MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_MAIN)).toContain(card);
        });
    });
});
