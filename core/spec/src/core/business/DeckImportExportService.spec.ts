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
import { DeckPart } from "src/core/model/DeckPart";
import { Card } from "src/core/model/Card";
import { deflate } from "pako";

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

    afterEach(() => {
        mockCardDatabase.reset();
    });

    describe("fromFile", () => {
        it("processes filename", () => {
            expect(
                deckImportExportService.fromFile({
                    fileContent: "",
                    fileName: "foo.ydk"
                }).deck.name
            ).toBe("foo");
        });

        it("puts missing", () => {
            const fileContent = `
#main
123`;
            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.missing.length).toBe(1);
            expect(result.missing).toContain("123");
        });

        it("puts card", () => {
            const fileContent = `
#main
123`;
            const card = createCard("123");
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.deck.parts.get(DECKPART_MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_MAIN)).toContain(card);
            expect(result.missing.length).toBe(0);
        });

        it("puts multiple", () => {
            const fileContent = `
#main
123
123
123`;
            const card = createCard("123");
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.deck.parts.get(DECKPART_MAIN)!.length).toBe(3);
            expect(result.deck.parts.get(DECKPART_MAIN)).toEqual([
                card,
                card,
                card
            ]);
            expect(result.missing.length).toBe(0);
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

            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.deck.parts.get(DECKPART_MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_MAIN)).toContain(card1);
            expect(result.deck.parts.get(DECKPART_EXTRA)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_EXTRA)).toContain(card2);
            expect(result.deck.parts.get(DECKPART_SIDE)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_SIDE)).toContain(card3);
            expect(result.missing.length).toBe(0);
        });

        it("ignores optional creator note", () => {
            const fileContent = `
#created by ...
#main
123`;
            const card = createCard("123");
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.deck.parts.get(DECKPART_MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DECKPART_MAIN)).toContain(card);
        });
    });

    describe("toFile", () => {
        it("processes name", () => {
            expect(
                deckImportExportService.toFile({
                    name: "foo",
                    parts: new Map<DeckPart, Card[]>([
                        [DECKPART_MAIN, []],
                        [DECKPART_EXTRA, []],
                        [DECKPART_SIDE, []]
                    ])
                }).fileName
            ).toBe("foo.ydk");
        });

        it("puts cards", () => {
            expect(
                deckImportExportService.toFile({
                    name: "foo",
                    parts: new Map<DeckPart, Card[]>([
                        [DECKPART_MAIN, [createCard("123")]],
                        [DECKPART_EXTRA, []],
                        [DECKPART_SIDE, []]
                    ])
                }).fileContent
            ).toContain(
                `#main
123`
            );
        });

        it("puts per deckpart", () => {
            expect(
                deckImportExportService.toFile({
                    name: "foo",
                    parts: new Map<DeckPart, Card[]>([
                        [DECKPART_MAIN, [createCard("123")]],
                        [DECKPART_EXTRA, [createCard("456")]],
                        [DECKPART_SIDE, [createCard("789")]]
                    ])
                }).fileContent
            ).toBe(
                `#main
123

#extra
456

!side
789
`
            );
        });
    });

    describe("fromLegacyUrlQueryParamValue", () => {
        it("puts per deckpart", () => {
            const queryParamValue = deflate("123|*2456|789;999;*3123", {
                to: "string"
            });
            const card1 = createCard("123");
            mockCardDatabase.registerCard("123", card1);
            const card2 = createCard("456");
            mockCardDatabase.registerCard("456", card2);
            const card3 = createCard("789");
            mockCardDatabase.registerCard("789", card3);
            const card4 = createCard("999");
            mockCardDatabase.registerCard("999", card4);
            expect(
                deckImportExportService.fromLegacyUrlQueryParamValue(
                    queryParamValue,
                    (str: string): string => str
                )
            ).toEqual({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DECKPART_MAIN, [card1]],
                    [DECKPART_EXTRA, [card2, card2]],
                    [DECKPART_SIDE, [card3, card4, card1, card1, card1]]
                ])
            });
        });
    });

    describe("toUrlQueryParamValue", () => {
        it("creates value", () => {
            const card1 = createCard("123");
            const card2 = createCard("456");
            const card3 = createCard("789");
            const card4 = createCard("999999999");

            const result = deckImportExportService.toUrlQueryParamValue({
                name: "foo",
                parts: new Map<DeckPart, Card[]>([
                    [DECKPART_MAIN, [card1]],
                    [DECKPART_EXTRA, [card2, card2]],
                    [DECKPART_SIDE, [card3, card4, card1, card1, card1]]
                ])
            });
            expect(result).toEqual(
                "eJyrZoCAE4wQDAKizAwM-0-Osq4GsmEYBNLy8wGk7Ad4"
            );
        });

        it("works with null name", () => {
            const card1 = createCard("123");
            const card2 = createCard("456");
            const card3 = createCard("789");

            const result = deckImportExportService.toUrlQueryParamValue({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DECKPART_MAIN, [card1]],
                    [DECKPART_EXTRA, [card2]],
                    [DECKPART_SIDE, [card3]]
                ])
            });
            expect(result).toEqual("eJyrZoCAE4wQWpQZQgMAGOwBXQ~~");
        });
    });

    describe("fromUrlQueryParamValue", () => {
        it("creates value", () => {
            const card1 = createCard("123");
            mockCardDatabase.registerCard("123", card1);
            const card2 = createCard("456");
            mockCardDatabase.registerCard("456", card2);
            const card3 = createCard("789");
            mockCardDatabase.registerCard("789", card3);
            const card4 = createCard("999999999");
            mockCardDatabase.registerCard("999999999", card4);

            const result = deckImportExportService.fromUrlQueryParamValue(
                "eJyrZoCAE4wQDAKizAwM-0-Osq4GsmEYBNLy8wGk7Ad4"
            );

            expect(result).toEqual({
                name: "foo",
                parts: new Map<DeckPart, Card[]>([
                    [DECKPART_MAIN, [card1]],
                    [DECKPART_EXTRA, [card2, card2]],
                    [DECKPART_SIDE, [card3, card4, card1, card1, card1]]
                ])
            });
        });

        it("works with null name", () => {
            const card1 = createCard("123");
            mockCardDatabase.registerCard("123", card1);
            const card2 = createCard("456");
            mockCardDatabase.registerCard("456", card2);
            const card3 = createCard("789");
            mockCardDatabase.registerCard("789", card3);

            const result = deckImportExportService.fromUrlQueryParamValue(
                "eJyrZoCAE4wQWpQZQgMAGOwBXQ~~"
            );

            expect(result).toEqual({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DECKPART_MAIN, [card1]],
                    [DECKPART_EXTRA, [card2]],
                    [DECKPART_SIDE, [card3]]
                ])
            });
        });
    });
});
