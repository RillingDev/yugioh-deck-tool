import "reflect-metadata";
import { createCard } from "../../helper/dataFactories";
import type { CardService } from "../../../src/main";
import { baseModule, TYPES } from "../../../src/main";
import { Container } from "inversify";

describe("CardService", () => {
    let cardService: CardService;

    beforeEach(() => {
        const container = new Container();
        container.load(baseModule);

        cardService = container.get<CardService>(TYPES.CardService);
    });

    describe("getUniqueByName", () => {
        it("gets unique by name", () => {
            const card1a = createCard({
                passcode: "123",
                name: "foo",
            });
            const card1b = createCard({
                passcode: "456",
                name: "foo",
            });
            const card2 = createCard({
                passcode: "789",
                name: "bar",
            });

            expect(
                cardService.getUniqueByName([card1a, card1b, card2])
            ).toEqual([card1a, card2]);
        });

        it("goes just by name, not alternate names like treatedAs", () => {
            const card1 = createCard({
                passcode: "123",
                name: "foo",
            });
            const card2 = createCard({
                passcode: "456",
                name: "fizz",
                treatedAs: "foo",
            });

            expect(cardService.getUniqueByName([card1, card2])).toEqual([
                card1,
                card2,
            ]);
        });
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

            expect(cardService.isTreatedAsSame(card1, card2)).toBeFalse();
        });

        it("returns true if the names overlap", () => {
            const card1 = createCard({ name: "foo" });
            const card2 = createCard({ name: "bar", treatedAs: "foo" });

            expect(cardService.isTreatedAsSame(card1, card2)).toBeTrue();
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
                "https://db.ygoprodeck.com/card/?search=Foo%20Bar"
            );
        });
    });
});
