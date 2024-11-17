import {createCard} from "../../helper/dataFactories";
import type {BanlistService, CardPredicate, CardService} from "@/core/lib";
import {CardTypeCategory, DeckPart, DefaultBanState, FilterService, Format,} from "@/core/lib";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {UnsupportedInvocationError} from "@/__tests__/helper/UnsupportedInvocationError";

describe("FilterService", () => {
	let filterService: FilterService;

	let cardServiceMock: CardService;
	let banlistServiceMock: BanlistService;

	beforeEach(() => {
		cardServiceMock = {
			getAllNames: vi.fn(),
			isTreatedAsSame: vi.fn(),
			countByCard: vi.fn(),
			countByType: vi.fn(),
			countByTypeCategory: vi.fn(),
			createFormattedCardCountList: vi.fn(),
		};

		banlistServiceMock = {
			hasBanlist: vi.fn(),
			getBanStateByFormat: vi.fn(),
		};

		filterService = new FilterService(cardServiceMock, banlistServiceMock);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("filter", () => {
		it("returns all without filter props", () => {
			const card1 = createCard({
				passcode: "123",
				name: "foo",
			});
			const card2 = createCard({
				passcode: "789",
				name: "bar",
			});

			expect(filterService.filter([card1, card2], {})).toEqual([
				card1,
				card2,
			]);
		});

		describe("name", () => {
			it("filters by name", () => {
				const card1 = createCard({
					passcode: "123",
					name: "foo",
				});
				const card2 = createCard({
					passcode: "789",
					name: "bar",
				});

				vi.mocked(cardServiceMock.getAllNames).mockImplementation(
					(card) => {
						if (card == card1) {
							return ["foo"];
						}
						if (card == card2) {
							return ["bar"];
						}
						throw new UnsupportedInvocationError();
					},
				);

				expect(
					filterService.filter([card1, card2], {
						name: "fo",
					}),
				).toEqual([card1]);
			});

			it("ignoring case", () => {
				const card1 = createCard({
					passcode: "123",
					name: "foo",
				});
				const card2 = createCard({
					passcode: "789",
					name: "bar",
				});

				vi.mocked(cardServiceMock.getAllNames).mockImplementation(
					(card) => {
						if (card == card1) {
							return ["foo"];
						}
						if (card == card2) {
							return ["bar"];
						}
						throw new UnsupportedInvocationError();
					},
				);

				expect(
					filterService.filter([card1, card2], {
						name: "fO",
					}),
				).toEqual([card1]);
			});

			it("for alternate names", () => {
				const card1 = createCard({
					passcode: "123",
					name: "foo",
				});
				const card2 = createCard({
					passcode: "789",
					name: "bar",
				});

				vi.mocked(cardServiceMock.getAllNames).mockImplementation(
					(card) => {
						if (card == card1) {
							return ["foo", "föö"];
						}
						if (card == card2) {
							return ["bar"];
						}
						throw new UnsupportedInvocationError();
					},
				);

				expect(
					filterService.filter([card1, card2], {
						name: "fö",
					}),
				).toEqual([card1]);
			});
		});

		describe("description", () => {
			it("filters by description", () => {
				const card1 = createCard({
					passcode: "123",
					description: "foo",
				});
				const card2 = createCard({
					passcode: "789",
					description: "bar",
				});

				vi.mocked(cardServiceMock.getAllNames).mockImplementation(
					(card) => {
						if (card == card1) {
							return ["foo"];
						}
						if (card == card2) {
							return ["bar"];
						}
						throw new UnsupportedInvocationError();
					},
				);

				expect(
					filterService.filter([card1, card2], {
						description: "fo",
					}),
				).toEqual([card1]);
			});

			it("ignoring case", () => {
				const card1 = createCard({
					passcode: "123",
					description: "foo",
				});
				const card2 = createCard({
					passcode: "789",
					description: "bar",
				});

				vi.mocked(cardServiceMock.getAllNames).mockImplementation(
					(card) => {
						if (card == card1) {
							return ["foo"];
						}
						if (card == card2) {
							return ["bar"];
						}
						throw new UnsupportedInvocationError();
					},
				);

				expect(
					filterService.filter([card1, card2], {
						description: "fO",
					}),
				).toEqual([card1]);
			});
		});

		it("filters by type category", () => {
			const card1 = createCard({
				passcode: "123",
				type: {
					category: CardTypeCategory.MONSTER,
					name: "Foo",
					deckParts: new Set([DeckPart.EXTRA]),
					sortGroup: 0,
				},
			});
			const card2 = createCard({
				passcode: "789",
				type: {
					category: CardTypeCategory.SPELL,
					name: "Bar",
					deckParts: new Set([DeckPart.EXTRA]),
					sortGroup: 0,
				},
			});

			expect(
				filterService.filter([card1, card2], {
					typeCategory: CardTypeCategory.MONSTER,
				}),
			).toEqual([card1]);
		});

		it("filters by type", () => {
			const type1 = {
				category: CardTypeCategory.MONSTER,
				name: "Foo",
				deckParts: new Set([DeckPart.EXTRA]),
				sortGroup: 0,
			};
			const type2 = {
				category: CardTypeCategory.SPELL,
				name: "Bar",
				deckParts: new Set([DeckPart.EXTRA]),
				sortGroup: 0,
			};
			const card1 = createCard({
				passcode: "123",
				type: type1,
			});
			const card2 = createCard({
				passcode: "789",
				type: type2,
			});

			expect(
				filterService.filter([card1, card2], {
					type: type1,
				}),
			).toEqual([card1]);
		});

		it("filters by sub-type", () => {
			const card1 = createCard({
				passcode: "123",
				subType: "foo",
			});
			const card2 = createCard({
				passcode: "789",
				subType: "bar",
			});

			expect(
				filterService.filter([card1, card2], {
					subType: "foo",
				}),
			).toEqual([card1]);
		});

		it("filters by level", () => {
			const card1 = createCard({
				passcode: "123",
				level: 1,
			});
			const card2 = createCard({
				passcode: "789",
				level: 12,
			});
			const card3 = createCard({
				passcode: "666",
				level: null,
			});

			expect(
				filterService.filter([card1, card2, card3], {
					level: 1,
				}),
			).toEqual([card1]);
		});

		it("filters by attribute", () => {
			const card1 = createCard({
				passcode: "123",
				attribute: "foo",
			});
			const card2 = createCard({
				passcode: "789",
				attribute: "bar",
			});
			const card3 = createCard({
				passcode: "666",
				attribute: null,
			});

			expect(
				filterService.filter([card1, card2, card3], {
					attribute: "foo",
				}),
			).toEqual([card1]);
		});

		it("filters by link marker", () => {
			const card1 = createCard({
				passcode: "123",
				linkMarkers: ["Top"],
			});
			const card2 = createCard({
				passcode: "789",
				linkMarkers: ["Top", "Bottom"],
			});
			const card3 = createCard({
				passcode: "666",
				linkMarkers: ["Bottom"],
			});
			const card4 = createCard({
				passcode: "321",
				linkMarkers: null,
			});

			expect(
				filterService.filter([card1, card2, card3, card4], {
					linkMarkers: ["Top"],
				}),
			).toEqual([card1, card2]);
		});

		it("filters by archetype", () => {
			const card1 = createCard({
				passcode: "123",
				archetype: "Foo",
			});
			const card2 = createCard({
				passcode: "789",
				archetype: "Bar",
			});

			expect(
				filterService.filter([card1, card2], {
					archetype: "Foo",
				}),
			).toEqual([card1]);
		});

		it("filters by format", () => {
			const card1 = createCard({
				passcode: "123",
				formats: [Format.TCG],
			});
			const card2 = createCard({
				passcode: "789",
				formats: [Format.TCG, Format.GOAT],
			});
			const card3 = createCard({
				passcode: "666",
				formats: [Format.OCG],
			});

			expect(
				filterService.filter([card1, card2, card3], {
					format: Format.TCG,
				}),
			).toEqual([card1, card2]);
		});

		describe("ban state", () => {
			it("filters by ban state", () => {
				const card1 = createCard({
					passcode: "123",
				});
				const card2 = createCard({
					passcode: "789",
				});

				vi.mocked(
					banlistServiceMock.getBanStateByFormat,
				).mockImplementation((card, format) => {
					if (format == Format.TCG) {
						if (card == card1) {
							return DefaultBanState.LIMITED;
						}
						if (card == card2) {
							return DefaultBanState.BANNED;
						}
					}
					throw new UnsupportedInvocationError();
				});

				expect(
					filterService.filter([card1, card2], {
						banState: DefaultBanState.LIMITED,
						format: Format.TCG,
					}),
				).toEqual([card1]);
			});

			it("ignores ban state if no format is set", () => {
				const card1 = createCard({
					passcode: "123",
				});
				const card2 = createCard({
					passcode: "789",
				});

				vi.mocked(
					banlistServiceMock.getBanStateByFormat,
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				).mockImplementation((card, _format) => {
					if (card == card1) {
						return DefaultBanState.LIMITED;
					}
					if (card == card2) {
						return DefaultBanState.BANNED;
					}
					throw new UnsupportedInvocationError();
				});

				expect(
					filterService.filter([card1, card2], {
						banState: DefaultBanState.LIMITED,
					}),
				).toEqual([card1, card2]);
			});
		});

		describe("set", () => {
			it("filters by set", () => {
				const set1 = { name: "Foo", code: "foo" };
				const set2 = { name: "Bar", code: "bar" };
				const card1 = createCard({
					passcode: "123",
					sets: [set1],
				});
				const card2 = createCard({
					passcode: "789",
					sets: [set1, set2],
				});
				const card3 = createCard({
					passcode: "666",
					sets: [set2],
				});

				expect(
					filterService.filter([card1, card2, card3], {
						sets: [set1],
					}),
				).toEqual([card1, card2]);
			});

			it("filters by set additive", () => {
				const set1 = { name: "Foo", code: "foo" };
				const set2 = { name: "Bar", code: "bar" };
				const set3 = { name: "Bar", code: "bar" };
				const card1 = createCard({
					passcode: "123",
					sets: [set1],
				});
				const card2 = createCard({
					passcode: "789",
					sets: [set1, set2],
				});
				const card3 = createCard({
					passcode: "666",
					sets: [set2, set3],
				});
				const card4 = createCard({
					passcode: "321",
					sets: [set3],
				});

				expect(
					filterService.filter([card1, card2, card3, card4], {
						sets: [set1, set2],
					}),
				).toEqual([card1, card2, card3]);
			});
		});

		describe("custom predicate", () => {
			it("uses custom predicate", () => {
				const predicate: CardPredicate = (card) =>
					card.passcode.includes("1");

				const card1 = createCard({
					passcode: "123",
				});
				const card2 = createCard({
					passcode: "789",
				});
				const card3 = createCard({
					passcode: "666",
				});
				const card4 = createCard({
					passcode: "321",
				});

				expect(
					filterService.filter([card1, card2, card3, card4], {
						customPredicates: [predicate],
					}),
				).toEqual([card1, card4]);
			});

			it("requires all custom predicates to return true", () => {
				const predicate1: CardPredicate = (card) =>
					card.passcode.includes("1");
				const predicate2: CardPredicate = (card) =>
					card.passcode.startsWith("3");

				const card1 = createCard({
					passcode: "123",
				});
				const card2 = createCard({
					passcode: "789",
				});
				const card3 = createCard({
					passcode: "666",
				});
				const card4 = createCard({
					passcode: "321",
				});

				expect(
					filterService.filter([card1, card2, card3, card4], {
						customPredicates: [predicate1, predicate2],
					}),
				).toEqual([card4]);
			});
		});
	});
});
