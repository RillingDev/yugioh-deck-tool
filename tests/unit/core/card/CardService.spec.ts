import { createCard } from "../../helper/dataFactories";
import { CardService } from "@/core/lib";

describe("CardService", () => {
	let cardService: CardService;

	beforeEach(() => {
		cardService = new CardService();
	});

	describe("getAllNames", () => {
		it("gets all names", () => {
			expect(
				cardService.getAllNames(
					createCard({
						name: "foo",
						treatedAs: "bar",
						betaName: "fizz",
					})
				)
			).toEqual(["foo", "bar", "fizz"]);
		});

		it("skips null", () => {
			expect(
				cardService.getAllNames(
					createCard({
						name: "foo",
						treatedAs: null,
						betaName: null,
					})
				)
			).toEqual(["foo"]);
		});
	});

	describe("isTreatedAsSame", () => {
		it("returns false if no names overlap", () => {
			const card1 = createCard({ name: "foo" });
			const card2 = createCard({ name: "bar", treatedAs: "bazz" });

			expect(cardService.isTreatedAsSame(card1, card2)).toBe(false);
		});

		it("returns true if the names overlap", () => {
			const card1 = createCard({ name: "foo" });
			const card2 = createCard({ name: "bar", treatedAs: "foo" });

			expect(cardService.isTreatedAsSame(card1, card2)).toBe(true);
		});
	});

	describe("countCards", () => {
		it("counts", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "678" });

			expect(
				cardService.countByCard([
					card1,
					card2,
					card1,
					card3,
					card3,
					card3,
				])
			).toEqual(
				new Map([
					[card1, 2],
					[card2, 1],
					[card3, 3],
				])
			);
		});
	});

	describe("createFormattedCardCountList", () => {
		it("creates formatted list", () => {
			const card1 = createCard({ passcode: "123", name: "Foo Bar" });
			const card2 = createCard({ passcode: "456", name: "Fizz" });

			expect(
				cardService.createFormattedCardCountList([
					card1,
					card2,
					card1,
					card1,
				])
			).toEqual(["3x Foo Bar", "1x Fizz"]);
		});
	});

	describe("getReferenceLink", () => {
		it("creates link to ygoprodeck db", () => {
			const card1 = createCard({ passcode: "123", name: "Foo Bar" });

			expect(cardService.getReferenceLink(card1)).toEqual(
				new URL("https://ygoprodeck.com/card/?search=Foo+Bar")
			);
		});
	});
});
