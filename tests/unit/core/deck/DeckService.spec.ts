import { createCard, createCardType } from "../../helper/dataFactories";
import type { Deck } from "@/core/lib";
import {
	CardTypeCategory,
	createBaseModule,
	DeckPart,
	DeckService,
	DefaultBanState,
	Format,
} from "@/core/lib";
import { MockCardDatabase } from "../../helper/MockCardDatabase";

describe("DeckService", () => {
	let deckService: DeckService;

	beforeEach(() => {
		const { cardService, banlistService, sortingService } =
			createBaseModule(new MockCardDatabase());

		deckService = new DeckService(
			cardService,
			sortingService,
			banlistService
		);
	});

	describe("createEmptyDeck", () => {
		it("creates empty deck", () => {
			expect(deckService.createEmptyDeck()).toEqual({
				name: null,
				parts: {
					[DeckPart.MAIN]: [],
					[DeckPart.EXTRA]: [],
					[DeckPart.SIDE]: [],
				},
			});
		});
	});

	describe("getAllCards", () => {
		it("gets all cards", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });
			expect(
				deckService.getAllCards({
					name: null,
					parts: {
						[DeckPart.MAIN]: [card1],
						[DeckPart.EXTRA]: [card2, card2],
						[DeckPart.SIDE]: [card3],
					},
				})
			).toEqual([card1, card2, card2, card3]);
		});
	});

	describe("canAdd", () => {
		it("checks deck part card types", () => {
			expect(
				deckService.canAdd(
					{
						name: null,
						parts: {
							[DeckPart.MAIN]: [],
							[DeckPart.EXTRA]: [],
							[DeckPart.SIDE]: [],
						},
					},
					createCard({
						passcode: "456",
						type: createCardType({
							deckPart: new Set([DeckPart.EXTRA]),
						}),
					}),
					DeckPart.MAIN,
					Format.TCG
				)
			).toBe(false);
		});

		it("checks deck part limit", () => {
			expect(
				deckService.canAdd(
					{
						name: null,
						parts: {
							[DeckPart.MAIN]: [],
							[DeckPart.EXTRA]: [],
							[DeckPart.SIDE]: new Array(15).fill(
								createCard({ passcode: "123" })
							),
						},
					},
					createCard({ passcode: "456" }),
					DeckPart.SIDE,
					Format.TCG
				)
			).toBe(false);
		});

		it("checks total link card count", () => {
			const card = createCard({
				passcode: "456",
				type: createCardType({ group: CardTypeCategory.SKILL }),
			});
			expect(
				deckService.canAdd(
					{
						name: null,
						parts: {
							[DeckPart.MAIN]: [],
							[DeckPart.EXTRA]: [],
							[DeckPart.SIDE]: [card],
						},
					},
					card,
					DeckPart.SIDE,
					Format.OCG
				)
			).toBe(false);
		});

		it("checks against ban list", () => {
			const card = createCard({
				passcode: "456",
				banlist: {
					[Format.OCG]: DefaultBanState.LIMITED,
					[Format.TCG]: DefaultBanState.UNLIMITED,
					[Format.GOAT]: DefaultBanState.UNLIMITED,
				},
			});
			expect(
				deckService.canAdd(
					{
						name: null,
						parts: {
							[DeckPart.MAIN]: [],
							[DeckPart.EXTRA]: [],
							[DeckPart.SIDE]: [card],
						},
					},
					card,
					DeckPart.SIDE,
					Format.OCG
				)
			).toBe(false);
		});

		it("returns true if a card can be added", () => {
			const card = createCard({
				passcode: "456",
			});
			expect(
				deckService.canAdd(
					{
						name: null,
						parts: {
							[DeckPart.MAIN]: [],
							[DeckPart.EXTRA]: [],
							[DeckPart.SIDE]: [],
						},
					},
					card,
					DeckPart.SIDE,
					Format.OCG
				)
			).toBe(true);
		});
	});

	describe("addCard", () => {
		it("adds card", () => {
			const card = createCard({
				passcode: "456",
			});
			const deck: Deck = {
				name: null,
				parts: {
					[DeckPart.MAIN]: [],
					[DeckPart.EXTRA]: [],
					[DeckPart.SIDE]: [],
				},
			};

			deckService.addCard(deck, card, DeckPart.SIDE);
			expect(deck).toEqual({
				name: null,
				parts: {
					[DeckPart.MAIN]: [],
					[DeckPart.EXTRA]: [],
					[DeckPart.SIDE]: [card],
				},
			});
		});
	});

	describe("removeCard", () => {
		it("removes card", () => {
			const card = createCard({
				passcode: "456",
			});
			const deck = {
				name: null,
				parts: {
					[DeckPart.MAIN]: [],
					[DeckPart.EXTRA]: [],
					[DeckPart.SIDE]: [card],
				},
			};

			deckService.removeCard(deck, card, DeckPart.SIDE);
			expect(deck).toEqual({
				name: null,
				parts: {
					[DeckPart.MAIN]: [],
					[DeckPart.EXTRA]: [],
					[DeckPart.SIDE]: [],
				},
			});
		});
	});
});
