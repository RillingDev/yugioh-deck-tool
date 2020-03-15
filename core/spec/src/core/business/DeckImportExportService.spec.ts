import "reflect-metadata";
import { container } from "../../../../src/inversify.config";
import { DeckImportExportService } from "../../../../src/core/business/DeckImportExportService";
import { TYPES } from "../../../../src/types";
import { CardDatabase } from "../../../../src/core/business/CardDatabase";
import { MockCardDatabase } from "../../helper/MockCardDatabase";
import { createCard } from "../../helper/dataFactories";
import {
    DefaultDeckPart,
    DeckPart
} from "../../../../src/core/model/ygo/DeckPart";
import { Card } from "../../../../src/core/model/ygo/Card";
import { deflate } from "pako";
import { HttpService } from "../../../../src/core/business/HttpService";
import { anyString, anything, instance, mock, verify, when } from "ts-mockito";
import { AxiosHttpService } from "../../../../src/core/business/AxiosHttpService";

describe("DeckImportExportService", () => {
    let deckImportExportService: DeckImportExportService;
    let mockCardDatabase: MockCardDatabase;
    let mockHttpServiceInstance: AxiosHttpService;

    beforeEach(() => {
        container
            .rebind<CardDatabase>(TYPES.CardDatabase)
            .to(MockCardDatabase)
            .inSingletonScope();
        mockHttpServiceInstance = mock(AxiosHttpService);
        container
            .rebind<HttpService>(TYPES.HttpService)
            .toConstantValue(instance(mockHttpServiceInstance));

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
            const card = createCard({ id: "123" });
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)).toContain(card);
            expect(result.missing.length).toBe(0);
        });

        it("puts multiple", () => {
            const fileContent = `
#main
123
123
123`;
            const card = createCard({ id: "123" });
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)!.length).toBe(3);
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)).toEqual([
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
            const card1 = createCard({ id: "123" });
            mockCardDatabase.registerCard("123", card1);
            const card2 = createCard({ id: "456" });
            mockCardDatabase.registerCard("456", card2);
            const card3 = createCard({ id: "789" });
            mockCardDatabase.registerCard("789", card3);

            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)).toContain(
                card1
            );
            expect(result.deck.parts.get(DefaultDeckPart.EXTRA)!.length).toBe(
                1
            );
            expect(result.deck.parts.get(DefaultDeckPart.EXTRA)).toContain(
                card2
            );
            expect(result.deck.parts.get(DefaultDeckPart.SIDE)!.length).toBe(1);
            expect(result.deck.parts.get(DefaultDeckPart.SIDE)).toContain(
                card3
            );
            expect(result.missing.length).toBe(0);
        });

        it("ignores optional creator note", () => {
            const fileContent = `
#created by ...
#main
123`;
            const card = createCard({ id: "123" });
            mockCardDatabase.registerCard("123", card);

            const result = deckImportExportService.fromFile({
                fileContent,
                fileName: "foo.ydk"
            });
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)).toContain(card);
        });
    });

    describe("fromRemoteFile", () => {
        it("errors for different origin", async () => {
            try {
                await deckImportExportService.fromRemoteFile(
                    "https://example.com",
                    "https://attacker.website.hax/foo/bar.ydk"
                );
                fail("Promise did not reject.");
            } catch (e) {
                expect(e.message).toBe(
                    "Decks can only be loaded from the same origin."
                );
            }

            verify(
                mockHttpServiceInstance.get(anyString(), anything())
            ).never();
        });

        it("loads name from path", async () => {
            when(
                mockHttpServiceInstance.get(anyString(), anything())
            ).thenResolve({
                data: "deck file content",
                status: 200,
                statusText: "status"
            });

            const result = await deckImportExportService.fromRemoteFile(
                "https://example.com",
                "https://example.com/foo/bar.ydk"
            );
            expect(result.deck.name).toBe("bar");
        });

        it("loads deck", async () => {
            const fileContent = `
#main
123`;
            const card = createCard({ id: "123" });
            mockCardDatabase.registerCard("123", card);
            when(
                mockHttpServiceInstance.get(anyString(), anything())
            ).thenResolve({
                data: fileContent,
                status: 200,
                statusText: "status"
            });

            const result = await deckImportExportService.fromRemoteFile(
                "https://example.com",
                "https://example.com/foo/bar.ydk"
            );
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)).toContain(card);
            expect(result.missing.length).toBe(0);
        });
    });

    describe("toFile", () => {
        it("processes name", () => {
            expect(
                deckImportExportService.toFile({
                    name: "foo",
                    parts: new Map<DeckPart, Card[]>([
                        [DefaultDeckPart.MAIN, []],
                        [DefaultDeckPart.EXTRA, []],
                        [DefaultDeckPart.SIDE, []]
                    ])
                }).fileName
            ).toBe("foo.ydk");
        });

        it("puts cards", () => {
            expect(
                deckImportExportService.toFile({
                    name: "foo",
                    parts: new Map<DeckPart, Card[]>([
                        [DefaultDeckPart.MAIN, [createCard({ id: "123" })]],
                        [DefaultDeckPart.EXTRA, []],
                        [DefaultDeckPart.SIDE, []]
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
                        [DefaultDeckPart.MAIN, [createCard({ id: "123" })]],
                        [DefaultDeckPart.EXTRA, [createCard({ id: "456" })]],
                        [DefaultDeckPart.SIDE, [createCard({ id: "789" })]]
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
            const card1 = createCard({ id: "123" });
            mockCardDatabase.registerCard("123", card1);
            const card2 = createCard({ id: "456" });
            mockCardDatabase.registerCard("456", card2);
            const card3 = createCard({ id: "789" });
            mockCardDatabase.registerCard("789", card3);
            const card4 = createCard({ id: "999" });
            mockCardDatabase.registerCard("999", card4);
            expect(
                deckImportExportService.fromLegacyUrlQueryParamValue(
                    queryParamValue,
                    (str: string): string => str
                )
            ).toEqual({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card4, card1, card1, card1]]
                ])
            });
        });
    });

    describe("toUrlQueryParamValue", () => {
        it("creates value", () => {
            const card1 = createCard({ id: "123" });
            const card2 = createCard({ id: "456" });
            const card3 = createCard({ id: "789" });
            const card4 = createCard({ id: "999999999" });

            const result = deckImportExportService.toUrlQueryParamValue({
                name: "foo",
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card4, card1, card1, card1]]
                ])
            });
            expect(result).toEqual(
                "eJyrZoCAE4wQDAKizAwM-0-Osq4GsmEYBNLy8wGk7Ad4"
            );
        });

        it("works with null name", () => {
            const card1 = createCard({ id: "123" });
            const card2 = createCard({ id: "456" });
            const card3 = createCard({ id: "789" });

            const result = deckImportExportService.toUrlQueryParamValue({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2]],
                    [DefaultDeckPart.SIDE, [card3]]
                ])
            });
            expect(result).toEqual("eJyrZoCAE4wQWpQZQgMAGOwBXQ~~");
        });
    });

    describe("fromUrlQueryParamValue", () => {
        it("creates value", () => {
            const card1 = createCard({ id: "123" });
            mockCardDatabase.registerCard("123", card1);
            const card2 = createCard({ id: "456" });
            mockCardDatabase.registerCard("456", card2);
            const card3 = createCard({ id: "789" });
            mockCardDatabase.registerCard("789", card3);
            const card4 = createCard({ id: "999999999" });
            mockCardDatabase.registerCard("999999999", card4);

            const result = deckImportExportService.fromUrlQueryParamValue(
                "eJyrZoCAE4wQDAKizAwM-0-Osq4GsmEYBNLy8wGk7Ad4"
            );

            expect(result).toEqual({
                name: "foo",
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card4, card1, card1, card1]]
                ])
            });
        });

        it("works with null name", () => {
            const card1 = createCard({ id: "123" });
            mockCardDatabase.registerCard("123", card1);
            const card2 = createCard({ id: "456" });
            mockCardDatabase.registerCard("456", card2);
            const card3 = createCard({ id: "789" });
            mockCardDatabase.registerCard("789", card3);

            const result = deckImportExportService.fromUrlQueryParamValue(
                "eJyrZoCAE4wQWpQZQgMAGOwBXQ~~"
            );

            expect(result).toEqual({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2]],
                    [DefaultDeckPart.SIDE, [card3]]
                ])
            });
        });
    });

    describe("toShareableText", () => {
        it("creates text", () => {
            const card1 = createCard({ id: "123", name: "foo" });
            const card2 = createCard({ id: "456", name: "bar" });
            const card3 = createCard({ id: "789", name: "fizz" });

            const result = deckImportExportService.toShareableText({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card3, card1, card3]]
                ])
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

            const result = deckImportExportService.toBuyLink({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card3, card1, card3]]
                ])
            });
            expect(result).toEqual(
                "https://store.tcgplayer.com/massentry?partner=YGOPRODeck&productline=Yugioh" +
                    `&c=${encodeURIComponent("||2 foo||2 bar||3 fizz||")}`
            );
        });
    });
});
