import "reflect-metadata";
import { container } from "../../../../src/inversify.config";
import { TYPES } from "../../../../src/types";
import { DeckService } from "../../../../src/core/business/DeckService";
import { DeckPart } from "../../../../src/core/model/DeckPart";
import { Card } from "../../../../src/core/model/Card";
import {
    DECKPART_EXTRA,
    DECKPART_MAIN,
    DECKPART_SIDE
} from "../../../../src/core/data/DeckParts";
import { createCard, createCardType } from "../../helper/dataFactories";
import { Format } from "../../../../src/core/model/Format";
import { BanState } from "../../../../src/core/model/BanState";

describe("DeckService", () => {
    let deckService: DeckService;

    beforeEach(() => {
        deckService = container.get<DeckService>(TYPES.DeckService);
    });

    describe("createEmptyDeck", () => {
        it("creates empty deck", () => {
            expect(deckService.createEmptyDeck()).toEqual({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DECKPART_MAIN, []],
                    [DECKPART_EXTRA, []],
                    [DECKPART_SIDE, []]
                ])
            });
        });
    });

    describe("getAllCards", () => {
        it("gets all cards", () => {
            const card1 = createCard({ id: "123" });
            const card2 = createCard({ id: "456" });
            const card3 = createCard({ id: "789" });
            expect(
                deckService.getAllCards({
                    name: null,
                    parts: new Map<DeckPart, Card[]>([
                        [DECKPART_MAIN, [card1]],
                        [DECKPART_EXTRA, [card2, card2]],
                        [DECKPART_SIDE, [card3]]
                    ])
                })
            ).toEqual([card1, card2, card2, card3]);
        });
    });

    describe("canAdd", () => {
        it("checks deck part check", () => {
            expect(
                deckService.canAdd(
                    {
                        name: null,
                        parts: new Map<DeckPart, Card[]>([
                            [DECKPART_MAIN, []],
                            [DECKPART_EXTRA, []],
                            [DECKPART_SIDE, []]
                        ])
                    },
                    DECKPART_MAIN,
                    Format.TCG,
                    createCard({
                        id: "456",
                        type: createCardType({
                            deckPart: new Set([DECKPART_EXTRA])
                        })
                    })
                )
            ).toBeFalse();
        });

        it("checks deck part limit", () => {
            expect(
                deckService.canAdd(
                    {
                        name: null,
                        parts: new Map<DeckPart, Card[]>([
                            [DECKPART_MAIN, []],
                            [DECKPART_EXTRA, []],
                            [
                                DECKPART_SIDE,
                                new Array(15).fill(createCard({ id: "123" }))
                            ]
                        ])
                    },
                    DECKPART_SIDE,
                    Format.TCG,
                    createCard({ id: "456" })
                )
            ).toBeFalse();
        });

        it("checks against ban list", () => {
            const card = createCard({
                id: "456",
                banlist: {
                    [Format.OCG]: BanState.LIMITED,
                    [Format.TCG]: BanState.UNLIMITED,
                    [Format.GOAT]: BanState.UNLIMITED
                }
            });
            expect(
                deckService.canAdd(
                    {
                        name: null,
                        parts: new Map<DeckPart, Card[]>([
                            [DECKPART_MAIN, []],
                            [DECKPART_EXTRA, []],
                            [DECKPART_SIDE, [card]]
                        ])
                    },
                    DECKPART_SIDE,
                    Format.OCG,
                    card
                )
            ).toBeFalse();
        });

        it("returns true if a card can be added", () => {
            const card = createCard({
                id: "456"
            });
            expect(
                deckService.canAdd(
                    {
                        name: null,
                        parts: new Map<DeckPart, Card[]>([
                            [DECKPART_MAIN, []],
                            [DECKPART_EXTRA, []],
                            [DECKPART_SIDE, []]
                        ])
                    },
                    DECKPART_SIDE,
                    Format.OCG,
                    card
                )
            ).toBeTrue();
        });
    });
});
