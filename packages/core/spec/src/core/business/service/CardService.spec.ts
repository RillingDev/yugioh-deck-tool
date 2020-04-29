import "reflect-metadata";
import { TYPES } from "../../../../../src/types";
import { createCard } from "../../../helper/dataFactories";
import { container } from "../../../../../src/inversify.config";
import { CardService } from "../../../../../src/core/business/service/CardService";
import { DefaultBanState } from "../../../../../src/core/model/ygo/BanState";
import { Format } from "../../../../../src/core/model/ygo/Format";

describe("CardService", () => {
    let cardService: CardService;

    beforeEach(() => {
        container.snapshot();

        cardService = container.get<CardService>(TYPES.CardService);
    });

    afterEach(() => {
        container.restore();
    });

    describe("getBanStateByFormat", () => {
        it("returns UNLIMITED if format is null", () => {
            expect(
                cardService.getBanStateByFormat(createCard({ id: "123" }), null)
            ).toBe(DefaultBanState.UNLIMITED);
        });

        it("returns BANNED if the format is not listed for this card", () => {
            expect(
                cardService.getBanStateByFormat(
                    createCard({ id: "123", formats: [Format.GOAT] }),
                    Format.RUSH_DUEL
                )
            ).toBe(DefaultBanState.BANNED);
        });

        it("returns UNLIMITED if the format has no banlist", () => {
            expect(
                cardService.getBanStateByFormat(
                    createCard({
                        id: "123",
                        formats: [Format.RUSH_DUEL],
                        banlist: {
                            [Format.TCG]: DefaultBanState.LIMITED,
                            [Format.OCG]: DefaultBanState.LIMITED,
                            [Format.GOAT]: DefaultBanState.LIMITED,
                        },
                    }),
                    Format.RUSH_DUEL
                )
            ).toBe(DefaultBanState.UNLIMITED);
        });

        it("returns banlist if the format has a banlist", () => {
            expect(
                cardService.getBanStateByFormat(
                    createCard({
                        id: "123",
                        formats: [Format.TCG],
                        banlist: {
                            [Format.TCG]: DefaultBanState.LIMITED,
                            [Format.OCG]: DefaultBanState.LIMITED,
                            [Format.GOAT]: DefaultBanState.LIMITED,
                        },
                    }),
                    Format.TCG
                )
            ).toBe(DefaultBanState.LIMITED);
        });
    });

    describe("getUniqueByName", () => {
        it("gets unique by name", () => {
            const card1a = createCard({
                id: "123",
                name: "foo",
            });
            const card1b = createCard({
                id: "456",
                name: "foo",
            });
            const card2 = createCard({
                id: "789",
                name: "bar",
            });

            expect(
                cardService.getUniqueByName([card1a, card1b, card2])
            ).toEqual([card1a, card2]);
        });

        it("goes just by name, not alternate names like treatedAs", () => {
            const card1 = createCard({
                id: "123",
                name: "foo",
            });
            const card2 = createCard({
                id: "456",
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
            const card1 = createCard({ id: "123" });
            const card2 = createCard({ id: "456" });
            const card3 = createCard({ id: "678" });

            expect(
                cardService.countCards([
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
});
