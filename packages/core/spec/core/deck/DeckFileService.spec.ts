import "reflect-metadata";
import {
    baseModule,
    CardDatabase,
    DeckFileService,
    deckModule,
    DeckPart,
    FindCardBy,
    TYPES,
} from "../../../src/main";
import { MemoryCardDatabase } from "../../../src/core/card/MemoryCardDatabase";
import { AxiosHttpService } from "../../../src/core/http/AxiosHttpService";
import { anyString, anything, verify, when } from "ts-mockito";
import { HttpService } from "../../../src/core/http/HttpService";
import { createCard } from "../../helper/dataFactories";
import { bindMock } from "../../helper/bindMock";
import { Container } from "inversify";

describe("DeckFileService", () => {
    let container: Container;

    let deckFileService: DeckFileService;

    let mockCardDatabase: CardDatabase;
    let mockHttpService: HttpService;

    beforeEach(() => {
        container = new Container();
        container.load(baseModule, deckModule);

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
            const card = createCard({ passcode: "123" });
            when(
                mockCardDatabase.hasCard("123", FindCardBy.PASSCODE)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("123", FindCardBy.PASSCODE)
            ).thenReturn(card);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
            expect(result.deck.parts[DeckPart.MAIN]).toContain(card);
            expect(result.missing.length).toBe(0);
        });

        it("puts multiple", () => {
            const fileContent = `
#main
123
123
123`;
            const card = createCard({ passcode: "123" });
            when(
                mockCardDatabase.hasCard("123", FindCardBy.PASSCODE)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("123", FindCardBy.PASSCODE)
            ).thenReturn(card);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.deck.parts[DeckPart.MAIN].length).toBe(3);
            expect(result.deck.parts[DeckPart.MAIN]).toEqual([
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

            const card1 = createCard({ passcode: "123" });
            when(
                mockCardDatabase.hasCard("123", FindCardBy.PASSCODE)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("123", FindCardBy.PASSCODE)
            ).thenReturn(card1);

            const card2 = createCard({ passcode: "456" });
            when(
                mockCardDatabase.hasCard("456", FindCardBy.PASSCODE)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("456", FindCardBy.PASSCODE)
            ).thenReturn(card2);

            const card3 = createCard({ passcode: "789" });
            when(
                mockCardDatabase.hasCard("789", FindCardBy.PASSCODE)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("789", FindCardBy.PASSCODE)
            ).thenReturn(card3);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
            expect(result.deck.parts[DeckPart.MAIN]).toContain(card1);
            expect(result.deck.parts[DeckPart.EXTRA]!.length).toBe(1);
            expect(result.deck.parts[DeckPart.EXTRA]).toContain(card2);
            expect(result.deck.parts[DeckPart.SIDE]!.length).toBe(1);
            expect(result.deck.parts[DeckPart.SIDE]).toContain(card3);
            expect(result.missing.length).toBe(0);
        });

        it("ignores optional creator note", () => {
            const fileContent = `
#created by ...
#main
123`;
            const card = createCard({ passcode: "123" });
            when(
                mockCardDatabase.hasCard("123", FindCardBy.PASSCODE)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("123", FindCardBy.PASSCODE)
            ).thenReturn(card);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
            expect(result.deck.parts[DeckPart.MAIN]).toContain(card);
        });

        it("supports zero-padded", () => {
            const fileContent = `
#created by ...
#main
0000123`;
            const card = createCard({ passcode: "123" });
            when(
                mockCardDatabase.hasCard("123", FindCardBy.PASSCODE)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("123", FindCardBy.PASSCODE)
            ).thenReturn(card);

            const result = deckFileService.fromFile({
                fileContent,
                fileName: "foo.ydk",
            });
            expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
            expect(result.deck.parts[DeckPart.MAIN]).toContain(card);
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
                expect((e as Error).message).toBe(
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
            const card = createCard({ passcode: "123" });
            when(
                mockCardDatabase.hasCard("123", FindCardBy.PASSCODE)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("123", FindCardBy.PASSCODE)
            ).thenReturn(card);
            when(mockHttpService.get(anyString(), anything())).thenResolve({
                data: fileContent,
                status: 200,
                statusText: "status",
            });

            const result = await deckFileService.fromRemoteFile(
                "https://example.com",
                "https://example.com/foo/bar.ydk"
            );
            expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
            expect(result.deck.parts[DeckPart.MAIN]).toContain(card);
            expect(result.missing.length).toBe(0);
        });
    });

    describe("toFile", () => {
        it("processes name", () => {
            expect(
                deckFileService.toFile({
                    name: "foo",
                    parts: {
                        [DeckPart.MAIN]: [],
                        [DeckPart.EXTRA]: [],
                        [DeckPart.SIDE]: [],
                    },
                }).fileName
            ).toBe("foo.ydk");
        });

        it("puts cards", () => {
            expect(
                deckFileService.toFile({
                    name: "foo",
                    parts: {
                        [DeckPart.MAIN]: [createCard({ passcode: "123" })],
                        [DeckPart.EXTRA]: [],
                        [DeckPart.SIDE]: [],
                    },
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
                    parts: {
                        [DeckPart.MAIN]: [createCard({ passcode: "123" })],
                        [DeckPart.EXTRA]: [createCard({ passcode: "456" })],
                        [DeckPart.SIDE]: [createCard({ passcode: "789" })],
                    },
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
