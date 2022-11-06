import { createCard } from "../../helper/dataFactories";
import {
	Format,
	SortingOrder,
	SortingService,
	SortingStrategy,
} from "@/core/lib";
import { MockCardDatabase } from "../../helper/MockCardDatabase";

describe("SortingService", () => {
	let sortingService: SortingService;

	beforeEach(() => {
		sortingService = new SortingService(new MockCardDatabase());
	});

	describe("sort", () => {
		describe("name", () => {
			it("sorts by name descending", () => {
				const card1 = createCard({
					passcode: "123",
					name: "abc",
				});
				const card2 = createCard({
					passcode: "789",
					name: "def",
				});

				expect(
					sortingService.sort([card1, card2, card1], {
						strategy: SortingStrategy.NAME,
						order: SortingOrder.DESC,
					})
				).toEqual([card1, card1, card2]);
			});

			it("sorts by name ascending", () => {
				const card1 = createCard({
					passcode: "123",
					name: "abc",
				});
				const card2 = createCard({
					passcode: "789",
					name: "def",
				});

				expect(
					sortingService.sort([card1, card2, card1], {
						strategy: SortingStrategy.NAME,
						order: SortingOrder.ASC,
					})
				).toEqual([card2, card1, card1]);
			});
		});

		describe("atk", () => {
			it("sorts by atk descending", () => {
				const card1 = createCard({
					passcode: "123",
					atk: 100,
				});
				const card2 = createCard({
					passcode: "789",
					atk: 200,
				});
				const card3 = createCard({
					passcode: "666",
					atk: null,
				});

				expect(
					sortingService.sort([card1, card2, card1, card3], {
						strategy: SortingStrategy.ATK,
						order: SortingOrder.DESC,
					})
				).toEqual([card2, card1, card1, card3]);
			});

			it("sorts by atk ascending", () => {
				const card1 = createCard({
					passcode: "123",
					atk: 100,
				});
				const card2 = createCard({
					passcode: "789",
					atk: 200,
				});
				const card3 = createCard({
					passcode: "666",
					atk: null,
				});

				expect(
					sortingService.sort([card1, card2, card1, card3], {
						strategy: SortingStrategy.ATK,
						order: SortingOrder.ASC,
					})
				).toEqual([card3, card1, card1, card2]);
			});
		});

		describe("def", () => {
			it("sorts by def descending", () => {
				const card1 = createCard({
					passcode: "123",
					def: 100,
				});
				const card2 = createCard({
					passcode: "789",
					def: 200,
				});
				const card3 = createCard({
					passcode: "666",
					def: null,
				});

				expect(
					sortingService.sort([card1, card2, card1, card3], {
						strategy: SortingStrategy.DEF,
						order: SortingOrder.DESC,
					})
				).toEqual([card2, card1, card1, card3]);
			});

			it("sorts by def ascending", () => {
				const card1 = createCard({
					passcode: "123",
					def: 100,
				});
				const card2 = createCard({
					passcode: "789",
					def: 200,
				});
				const card3 = createCard({
					passcode: "666",
					def: null,
				});

				expect(
					sortingService.sort([card1, card2, card1, card3], {
						strategy: SortingStrategy.DEF,
						order: SortingOrder.ASC,
					})
				).toEqual([card3, card1, card1, card2]);
			});
		});

		describe("level", () => {
			it("sorts by level descending", () => {
				const card1 = createCard({
					passcode: "123",
					level: 1,
				});
				const card2 = createCard({
					passcode: "789",
					level: 4,
				});
				const card3 = createCard({
					passcode: "666",
					level: null,
				});

				expect(
					sortingService.sort([card1, card2, card1, card3], {
						strategy: SortingStrategy.LEVEL,
						order: SortingOrder.DESC,
					})
				).toEqual([card2, card1, card1, card3]);
			});

			it("sorts by level ascending", () => {
				const card1 = createCard({
					passcode: "123",
					level: 1,
				});
				const card2 = createCard({
					passcode: "789",
					level: 4,
				});
				const card3 = createCard({
					passcode: "666",
					level: null,
				});

				expect(
					sortingService.sort([card1, card2, card1, card3], {
						strategy: SortingStrategy.LEVEL,
						order: SortingOrder.ASC,
					})
				).toEqual([card3, card1, card1, card2]);
			});
		});

		describe("views", () => {
			it("sorts by views descending", () => {
				const card1 = createCard({
					passcode: "123",
					views: 1,
				});
				const card2 = createCard({
					passcode: "789",
					views: 4,
				});

				expect(
					sortingService.sort([card1, card2, card1], {
						strategy: SortingStrategy.VIEWS,
						order: SortingOrder.DESC,
					})
				).toEqual([card2, card1, card1]);
			});

			it("sorts by views ascending", () => {
				const card1 = createCard({
					passcode: "123",
					views: 1,
				});
				const card2 = createCard({
					passcode: "789",
					views: 4,
				});

				expect(
					sortingService.sort([card1, card2, card1], {
						strategy: SortingStrategy.VIEWS,
						order: SortingOrder.ASC,
					})
				).toEqual([card1, card1, card2]);
			});
		});

		describe("release tcg", () => {
			it("sorts by release tcg descending", () => {
				const card1 = createCard({
					passcode: "123",
					release: {
						[Format.TCG]: new Date(
							"2001-01-01T00:00:00.0000"
						).getTime(),
						[Format.OCG]: null,
					},
				});
				const card2 = createCard({
					passcode: "789",
					release: {
						[Format.TCG]: new Date(
							"2020-01-01T00:00:00.0000"
						).getTime(),
						[Format.OCG]: null,
					},
				});
				const card3 = createCard({
					passcode: "666",
					release: {
						[Format.TCG]: null,
						[Format.OCG]: null,
					},
				});

				const actual = sortingService.sort(
					[card1, card2, card1, card3],
					{
						strategy: SortingStrategy.RELEASE_TCG,
						order: SortingOrder.DESC,
					}
				);
				expect(actual).toEqual([card2, card1, card1, card3]);
			});

			it("sorts by release tcg ascending", () => {
				const card1 = createCard({
					passcode: "123",
					release: {
						[Format.TCG]: new Date(
							"2001-01-01T00:00:00.0000"
						).getTime(),
						[Format.OCG]: null,
					},
				});
				const card2 = createCard({
					passcode: "789",
					release: {
						[Format.TCG]: new Date(
							"2020-01-01T00:00:00.0000"
						).getTime(),
						[Format.OCG]: null,
					},
				});
				const card3 = createCard({
					passcode: "666",
					release: {
						[Format.TCG]: null,
						[Format.OCG]: null,
					},
				});

				const actual = sortingService.sort(
					[card1, card2, card1, card3],
					{
						strategy: SortingStrategy.RELEASE_TCG,
						order: SortingOrder.ASC,
					}
				);
				expect(actual).toEqual([card1, card1, card2, card3]);
			});
		});

		describe("release ocg", () => {
			it("sorts by release ocg descending", () => {
				const card1 = createCard({
					passcode: "123",
					release: {
						[Format.TCG]: null,
						[Format.OCG]: new Date(
							"2001-01-01T00:00:00.0000"
						).getTime(),
					},
				});
				const card2 = createCard({
					passcode: "789",
					release: {
						[Format.TCG]: null,
						[Format.OCG]: new Date(
							"2020-01-01T00:00:00.0000"
						).getTime(),
					},
				});
				const card3 = createCard({
					passcode: "666",
					release: {
						[Format.TCG]: null,
						[Format.OCG]: null,
					},
				});

				const actual = sortingService.sort(
					[card1, card2, card1, card3],
					{
						strategy: SortingStrategy.RELEASE_OCG,
						order: SortingOrder.DESC,
					}
				);
				expect(actual).toEqual([card2, card1, card1, card3]);
			});

			it("sorts by release ocg ascending", () => {
				const card1 = createCard({
					passcode: "123",
					release: {
						[Format.TCG]: null,
						[Format.OCG]: new Date(
							"2001-01-01T00:00:00.0000"
						).getTime(),
					},
				});
				const card2 = createCard({
					passcode: "789",
					release: {
						[Format.TCG]: null,
						[Format.OCG]: new Date(
							"2020-01-01T00:00:00.0000"
						).getTime(),
					},
				});
				const card3 = createCard({
					passcode: "666",
					release: {
						[Format.TCG]: null,
						[Format.OCG]: null,
					},
				});

				const actual = sortingService.sort(
					[card1, card2, card1, card3],
					{
						strategy: SortingStrategy.RELEASE_OCG,
						order: SortingOrder.ASC,
					}
				);
				expect(actual).toEqual([card1, card1, card2, card3]);
			});
		});
	});
});
