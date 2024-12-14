import { createCard } from "../../helper/dataFactories";
import type { CardDatabase } from "@/core/lib";
import {
	BanlistService,
	CardService,
	DeckPart,
	DeckService,
	DeckUriEncodingService,
	FindCardBy,
	SortingService,
} from "@/core/lib";
import { MockCardDatabase } from "../../helper/MockCardDatabase";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UnsupportedInvocationError } from "@/__tests__/helper/UnsupportedInvocationError";

describe("DeckUriEncodingService", () => {
	let deckUriEncodingService: DeckUriEncodingService;

	let cardDatabaseMock: CardDatabase;

	beforeEach(() => {
		cardDatabaseMock = new MockCardDatabase();

		const deckService = new DeckService(
			new CardService(),
			new SortingService(cardDatabaseMock),
			new BanlistService(),
		);

		deckUriEncodingService = new DeckUriEncodingService(
			cardDatabaseMock,
			deckService,
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("toUrlQueryParamValue", () => {
		it("creates value", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });
			const card4 = createCard({ passcode: "999999999" });

			const result = deckUriEncodingService.toUrlQueryParamValue({
				name: "foo",
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2, card2],
					[DeckPart.SIDE]: [card3, card4, card1, card1, card1],
				},
			});
			expect(result).toEqual(
				"ewAAAA==!yAEAAMgBAAA=!FQMAAP/Jmjt7AAAAewAAAHsAAAA=!foo",
			);
		});

		it("works with null name", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });

			const result = deckUriEncodingService.toUrlQueryParamValue({
				name: null,
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2],
					[DeckPart.SIDE]: [card3],
				},
			});
			expect(result).toEqual("ewAAAA==!yAEAAA==!FQMAAA==!");
		});

		it("works with special name", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });

			const result = deckUriEncodingService.toUrlQueryParamValue({
				name: "Danger! (Special Characters) & More",
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2],
					[DeckPart.SIDE]: [card3],
				},
			});
			expect(result).toEqual(
				"ewAAAA==!yAEAAA==!FQMAAA==!Danger! (Special Characters) & More",
			);
		});
	});

	describe("fromUrlQueryParamValue", () => {
		it("reads value", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });
			const card4 = createCard({ passcode: "999999999" });

			vi.mocked(cardDatabaseMock.hasCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (findCardBy == FindCardBy.PASSCODE) {
						if (
							cardKey == "123" ||
							cardKey == "456" ||
							cardKey == "789" ||
							cardKey == "999999999"
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
						if (cardKey == "999999999") {
							return card4;
						}
					}
					throw new UnsupportedInvocationError();
				},
			);

			const result = deckUriEncodingService.fromUrlQueryParamValue(
				"ewAAAA==!yAEAAMgBAAA=!FQMAAP/Jmjt7AAAAewAAAHsAAAA=!foo",
			);

			expect(result).toEqual({
				name: "foo",
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2, card2],
					[DeckPart.SIDE]: [card3, card4, card1, card1, card1],
				},
			});
		});

		it("works with null name", () => {
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

			const result = deckUriEncodingService.fromUrlQueryParamValue(
				"ewAAAA==!yAEAAA==!FQMAAA==!",
			);

			expect(result).toEqual({
				name: null,
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2],
					[DeckPart.SIDE]: [card3],
				},
			});
		});

		it("works with special name", () => {
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

			const result = deckUriEncodingService.fromUrlQueryParamValue(
				"ewAAAA==!yAEAAA==!FQMAAA==!Danger! (Special Characters) & More",
			);

			expect(result).toEqual({
				name: "Danger! (Special Characters) & More",
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2],
					[DeckPart.SIDE]: [card3],
				},
			});
		});
	});

	describe("fromLegacyUrlQueryParamValue", () => {
		it("reads value", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });
			const card4 = createCard({ passcode: "999999999" });

			vi.mocked(cardDatabaseMock.hasCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (findCardBy == FindCardBy.PASSCODE) {
						if (
							cardKey == "123" ||
							cardKey == "456" ||
							cardKey == "789" ||
							cardKey == "999999999"
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
						if (cardKey == "999999999") {
							return card4;
						}
					}
					throw new UnsupportedInvocationError();
				},
			);

			const result = deckUriEncodingService.fromLegacyUrlQueryParamValue(
				"q2aAgBOMEAwCoswMDP9PzrKuBrJhGATS8vMB",
			);

			expect(result).toEqual({
				name: "foo",
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2, card2],
					[DeckPart.SIDE]: [card3, card4, card1, card1, card1],
				},
			});
		});

		it("works with null name", () => {
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

			const result = deckUriEncodingService.fromLegacyUrlQueryParamValue(
				"q2aAgBOMEFqUGUIDAA~~",
			);

			expect(result).toEqual({
				name: null,
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2],
					[DeckPart.SIDE]: [card3],
				},
			});
		});
	});

	describe("toUri", () => {
		it("creates value", () => {
			const card1 = createCard({ passcode: "5050644" });
			const card2 = createCard({ passcode: "29189613" });
			const card3 = createCard({ passcode: "38148100" });

			const result = deckUriEncodingService.toUri({
				name: "foo",
				parts: {
					[DeckPart.MAIN]: [card1, card2, card2],
					[DeckPart.EXTRA]: [card3],
					[DeckPart.SIDE]: [card1],
				},
			});
			expect(result).toEqual(
				new URL("ydke://FBFNAO1lvQHtZb0B!BBhGAg==!FBFNAA==!"),
			);
		});
	});

	describe("fromUri", () => {
		it("reads value", () => {
			const card1 = createCard({ passcode: "5050644" });
			const card2 = createCard({ passcode: "29189613" });
			const card3 = createCard({ passcode: "38148100" });
			vi.mocked(cardDatabaseMock.hasCard).mockImplementation(
				(cardKey, findCardBy) => {
					if (findCardBy == FindCardBy.PASSCODE) {
						if (
							cardKey == "5050644" ||
							cardKey == "29189613" ||
							cardKey == "38148100"
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
						if (cardKey == "5050644") {
							return card1;
						}
						if (cardKey == "29189613") {
							return card2;
						}
						if (cardKey == "38148100") {
							return card3;
						}
					}
					throw new UnsupportedInvocationError();
				},
			);

			const result = deckUriEncodingService.fromUri(
				"ydke://FBFNAO1lvQHtZb0B!BBhGAg==!FBFNAA==!",
			);

			expect(result).toEqual({
				name: null,
				parts: {
					[DeckPart.MAIN]: [card1, card2, card2],
					[DeckPart.EXTRA]: [card3],
					[DeckPart.SIDE]: [card1],
				},
			});
		});
	});
});
