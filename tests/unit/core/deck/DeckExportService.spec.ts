import { createCard, createCardType } from "../../helper/dataFactories";
import {
	CardTypeCategory,
	createBaseModule,
	DeckExportService,
	DeckPart,
	DeckService,
} from "@/core/lib";
import { MockCardDatabase } from "../../helper/MockCardDatabase";

describe("DeckExportService", () => {
	let deckExportService: DeckExportService;

	beforeEach(() => {
		const { cardService, filterService, banlistService, sortingService } =
			createBaseModule(new MockCardDatabase());

		deckExportService = new DeckExportService(
			new DeckService(cardService, sortingService, banlistService),
			cardService,
			filterService
		);
	});

	describe("toShareableText", () => {
		it("creates text", () => {
			const card1 = createCard({
				passcode: "123",
				name: "foo",
				type: createCardType({ group: CardTypeCategory.SPELL }),
			});
			const card2 = createCard({
				passcode: "321",
				name: "foo ooo",
				type: createCardType({ group: CardTypeCategory.MONSTER }),
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
			expect(result).toEqual(`Monster:
2x foo ooo

Spell:
1x foo

Extra:
2x bar

Side:
3x fizz
1x foo
`);
		});
	});

	describe("toBuyLink", () => {
		it("creates text", () => {
			const card1 = createCard({ passcode: "123", name: "foo" });
			const card2 = createCard({ passcode: "456", name: "bar" });
			const card3 = createCard({ passcode: "789", name: "fizz" });

			const result = deckExportService.toBuyLink(
				{
					name: null,
					parts: {
						[DeckPart.MAIN]: [card1],
						[DeckPart.EXTRA]: [card2, card2],
						[DeckPart.SIDE]: [card3, card3, card1, card3],
					},
				},
				{
					medium: "deck-builder",
					source: "YGOPRODeck",
				}
			);

			const expected = new URL("https://www.tcgplayer.com/massentry");
			expected.searchParams.append("productline", "Yugioh");
			expected.searchParams.append("utm_campaign", "affiliate");
			expected.searchParams.append("utm_medium", "deck-builder");
			expected.searchParams.append("utm_source", "YGOPRODeck");
			expected.searchParams.append("c", "2 foo||2 bar||3 fizz||");

			expect(result).toEqual(expected);
		});
	});
});
