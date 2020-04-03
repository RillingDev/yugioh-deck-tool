import "reflect-metadata";
import { TYPES } from "../../../../../src/types";
import { CardDatabase } from "../../../../../src/core/business/CardDatabase";
import { createCard } from "../../../helper/dataFactories";
import {
    DeckPart,
    DefaultDeckPart,
} from "../../../../../src/core/model/ygo/DeckPart";
import { Card } from "../../../../../src/core/model/ygo/Card";
import { HttpService } from "../../../../../src/core/business/service/HttpService";
import { anyString, anything, verify, when } from "ts-mockito";
import { AxiosHttpService } from "../../../../../src/core/business/service/AxiosHttpService";
import { MemoryCardDatabase } from "../../../../../src/core/business/MemoryCardDatabase";
import { container } from "../../../../../src/inversify.config";
import { bindMock } from "../../../helper/bindMock";
import { DeckFileService } from "../../../../../src/core/business/service/DeckFileService";

describe("DeckFileService", () => {
    let deckFileService: DeckFileService;

    let mockCardDatabase: CardDatabase;
    let mockHttpService: HttpService;

    beforeEach(() => {
        container.snapshot();

        mockCardDatabase = bindMock<CardDatabase>(
            container,
            TYPES.CardDatabase,
            MemoryCardDatabase
        );
        mockHttpService = bindMock<HttpService>(
            container,
            TYPES.HttpService,
            AxiosHttpService
        );

        deckFileService = container.get<DeckFileService>(TYPES.DeckFileService);
    });

    afterEach(() => {
        container.restore();
    });

    describe("fromFile", () => {
        it("processes filename", () => {
            expect(
                deckFileService.fromFile({
                    fileContent: "",
                    fileName: "foo.ydk",
                }).deck.name
            ).toBe("foo");
        });

        it("puts missing", () => {
            const fileContent = `
#main
123`;
            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.missing.length).toBe(1);
            expect(result.missing).toContain("123");
        });

        it("puts card", () => {
            const fileContent = `
#main
123`;
            const card = createCard({ id: "123" });
            when(mockCardDatabase.hasCard("123")).thenReturn(true);
            when(mockCardDatabase.getCard("123")).thenReturn(card);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
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
            when(mockCardDatabase.hasCard("123")).thenReturn(true);
            when(mockCardDatabase.getCard("123")).thenReturn(card);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)!.length).toBe(3);
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)).toEqual([
                card,
                card,
                card,
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
            when(mockCardDatabase.hasCard("123")).thenReturn(true);
            when(mockCardDatabase.getCard("123")).thenReturn(card1);
            const card2 = createCard({ id: "456" });

            when(mockCardDatabase.hasCard("456")).thenReturn(true);
            when(mockCardDatabase.getCard("456")).thenReturn(card2);

            const card3 = createCard({ id: "789" });
            when(mockCardDatabase.hasCard("789")).thenReturn(true);
            when(mockCardDatabase.getCard("789")).thenReturn(card3);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
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
            when(mockCardDatabase.hasCard("123")).thenReturn(true);
            when(mockCardDatabase.getCard("123")).thenReturn(card);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)).toContain(card);
        });

        it("supports zero-padded", () => {
            const fileContent = `
#created by ...
#main
0000123`;
            const card = createCard({ id: "123" });
            when(mockCardDatabase.hasCard("123")).thenReturn(true);
            when(mockCardDatabase.getCard("123")).thenReturn(card);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)!.length).toBe(1);
            expect(result.deck.parts.get(DefaultDeckPart.MAIN)).toContain(card);
        });
    });

    describe("fromRemoteFile", () => {
        it("errors for different origin", async () => {
            try {
                await deckFileService.fromRemoteFile(
                    "https://example.com",
                    "https://attacker.website.hax/foo/bar.ydk"
                );
                fail("Promise did not reject.");
            } catch (e) {
                expect(e.message).toBe(
                    "Decks can only be loaded from the same origin."
                );
            }

            verify(mockHttpService.get(anyString(), anything())).never();
        });

        it("loads name from path", async () => {
            when(mockHttpService.get(anyString(), anything())).thenResolve({
                data: "deck file content",
                status: 200,
                statusText: "status",
            });

            const result = await deckFileService.fromRemoteFile(
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
            when(mockCardDatabase.hasCard("123")).thenReturn(true);
            when(mockCardDatabase.getCard("123")).thenReturn(card);
            when(mockHttpService.get(anyString(), anything())).thenResolve({
                data: fileContent,
                status: 200,
                statusText: "status",
            });

            const result = await deckFileService.fromRemoteFile(
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
                deckFileService.toFile({
                    name: "foo",
                    parts: new Map<DeckPart, Card[]>([
                        [DefaultDeckPart.MAIN, []],
                        [DefaultDeckPart.EXTRA, []],
                        [DefaultDeckPart.SIDE, []],
                    ]),
                }).fileName
            ).toBe("foo.ydk");
        });

        it("puts cards", () => {
            expect(
                deckFileService.toFile({
                    name: "foo",
                    parts: new Map<DeckPart, Card[]>([
                        [DefaultDeckPart.MAIN, [createCard({ id: "123" })]],
                        [DefaultDeckPart.EXTRA, []],
                        [DefaultDeckPart.SIDE, []],
                    ]),
                }).fileContent
            ).toContain(
                `#main
123`
            );
        });

        it("puts per deckpart", () => {
            expect(
                deckFileService.toFile({
                    name: "foo",
                    parts: new Map<DeckPart, Card[]>([
                        [DefaultDeckPart.MAIN, [createCard({ id: "123" })]],
                        [DefaultDeckPart.EXTRA, [createCard({ id: "456" })]],
                        [DefaultDeckPart.SIDE, [createCard({ id: "789" })]],
                    ]),
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
});
