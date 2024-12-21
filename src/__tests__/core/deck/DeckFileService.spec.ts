import { createCard } from "../../helper/dataFactories";
import {
	BanlistService,
	type CardDatabase,
	CardService,
	DeckFileService,
	DeckPart,
	DeckService,
	FindCardBy,
	SortingService,
} from "@/core/lib";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UnsupportedInvocationError } from "@/__tests__/helper/UnsupportedInvocationError";
import { MockCardDatabase } from "@/__tests__/helper/MockCardDatabase";

describe("DeckFileService", () => {
	let cardDatabaseMock: CardDatabase;

	let deckFileService: DeckFileService;

	beforeEach(() => {
		cardDatabaseMock = new MockCardDatabase();

		const deckService = new DeckService(
			new CardService(),
			new SortingService(cardDatabaseMock),
			new BanlistService(),
		);

		deckFileService = new DeckFileService(cardDatabaseMock, deckService);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("fromFile", () => {
		it("processes filename", () => {
			expect(
				deckFileService.fromFile({
					fileContent: "",
					fileName: "foo.ydk",
				}).deck.name,
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
			vi.mocked(cardDatabaseMock.hasCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (cardKey == "123" && findCardBy == FindCardBy.PASSCODE) {
						return true;
					}
					throw new UnsupportedInvocationError();
				},
			);
			vi.mocked(cardDatabaseMock.getCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (cardKey == "123" && findCardBy == FindCardBy.PASSCODE) {
						return card;
					}
					throw new UnsupportedInvocationError();
				},
			);

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
			vi.mocked(cardDatabaseMock.hasCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (cardKey == "123" && findCardBy == FindCardBy.PASSCODE) {
						return true;
					}
					throw new UnsupportedInvocationError();
				},
			);
			vi.mocked(cardDatabaseMock.getCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (cardKey == "123" && findCardBy == FindCardBy.PASSCODE) {
						return card;
					}
					throw new UnsupportedInvocationError();
				},
			);

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
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });
			vi.mocked(cardDatabaseMock.hasCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (findCardBy == FindCardBy.PASSCODE) {
						if (
							cardKey == "123" ||
							cardKey == "456" ||
							cardKey == "789"
						) {
							return true;
						}
					}
					throw new UnsupportedInvocationError();
				},
			);
			vi.mocked(cardDatabaseMock.getCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (findCardBy == FindCardBy.PASSCODE) {
						if (cardKey == "123") {
							return card1;
						}
						if (cardKey == "456") {
							return card2;
						}
						if (cardKey == "789") {
							return card3;
						}
					}
					throw new UnsupportedInvocationError();
				},
			);

			const result = deckFileService.fromFile({
				fileContent,
				fileName: "foo.ydk",
			});
			expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
			expect(result.deck.parts[DeckPart.MAIN]).toContain(card1);
			expect(result.deck.parts[DeckPart.EXTRA].length).toBe(1);
			expect(result.deck.parts[DeckPart.EXTRA]).toContain(card2);
			expect(result.deck.parts[DeckPart.SIDE].length).toBe(1);
			expect(result.deck.parts[DeckPart.SIDE]).toContain(card3);
			expect(result.missing.length).toBe(0);
		});

		it("ignores optional creator note", () => {
			const fileContent = `
#created by ...
#main
123`;
			const card = createCard({ passcode: "123" });
			vi.mocked(cardDatabaseMock.hasCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (cardKey == "123" && findCardBy == FindCardBy.PASSCODE) {
						return true;
					}
					throw new UnsupportedInvocationError();
				},
			);
			vi.mocked(cardDatabaseMock.getCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (cardKey == "123" && findCardBy == FindCardBy.PASSCODE) {
						return card;
					}
					throw new UnsupportedInvocationError();
				},
			);

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
			vi.mocked(cardDatabaseMock.hasCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (cardKey == "123" && findCardBy == FindCardBy.PASSCODE) {
						return true;
					}
					throw new UnsupportedInvocationError();
				},
			);
			vi.mocked(cardDatabaseMock.getCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (cardKey == "123" && findCardBy == FindCardBy.PASSCODE) {
						return card;
					}
					throw new UnsupportedInvocationError();
				},
			);

			const result = deckFileService.fromFile({
				fileContent,
				fileName: "foo.ydk",
			});
			expect(result.deck.parts[DeckPart.MAIN].length).toBe(1);
			expect(result.deck.parts[DeckPart.MAIN]).toContain(card);
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
				}).fileName,
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
				}).fileContent,
			).toContain(
				`#main
123`,
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
				}).fileContent,
			).toBe(
				`#main
123

#extra
456

!side
789
`,
			);
		});
	});
});
