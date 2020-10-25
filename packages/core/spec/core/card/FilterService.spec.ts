import "reflect-metadata";

import { createCard } from "../../helper/dataFactories";
import { Container } from "inversify";
import { anything, when } from "ts-mockito";
import { bindMock } from "../../helper/bindMock";
import { CardService } from "../../../src/core/card/CardService";
import type { FilterService } from "../../../src/core/card/FilterService";
import { baseModule } from "../../../src/inversify.config";
import { BanlistService } from "../../../src/core/card/banlist/BanlistService";
import { TYPES } from "../../../src/types";
import { CardTypeCategory } from "../../../src/core/card/type/CardTypeCategory";
import { DeckPart } from "../../../src/core/deck/DeckPart";
import { Format } from "../../../src/core/card/format/Format";
import { DefaultBanState } from "../../../src/core/card/banlist/BanState";

describe("FilterService", () => {
    let filterService: FilterService;

    let mockCardService: CardService;
    let mockBanlistService: BanlistService;

    beforeEach(() => {
        const container = new Container();
        container.load(baseModule);

        mockCardService = bindMock<CardService>(
            container,
            TYPES.CardService,
            CardService
        );
        mockBanlistService = bindMock<BanlistService>(
            container,
            TYPES.BanlistService,
            BanlistService
        );

        filterService = container.get<FilterService>(TYPES.FilterService);
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

        it("filters by name", () => {
            const card1 = createCard({
                passcode: "123",
                name: "foo",
            });
            const card2 = createCard({
                passcode: "789",
                name: "bar",
            });

            when(mockCardService.getAllNames(card1)).thenReturn(["foo"]);
            when(mockCardService.getAllNames(card2)).thenReturn(["bar"]);

            expect(
                filterService.filter([card1, card2], {
                    name: "fo",
                })
            ).toEqual([card1]);
        });

        it("filters by name ignoring case", () => {
            const card1 = createCard({
                passcode: "123",
                name: "foo",
            });
            const card2 = createCard({
                passcode: "789",
                name: "bar",
            });

            when(mockCardService.getAllNames(card1)).thenReturn(["foo"]);
            when(mockCardService.getAllNames(card2)).thenReturn(["bar"]);

            expect(
                filterService.filter([card1, card2], {
                    name: "fO",
                })
            ).toEqual([card1]);
        });

        it("filters by name for alternate names", () => {
            const card1 = createCard({
                passcode: "123",
                name: "foo",
            });
            const card2 = createCard({
                passcode: "789",
                name: "bar",
            });

            when(mockCardService.getAllNames(card1)).thenReturn(["foo", "föö"]);
            when(mockCardService.getAllNames(card2)).thenReturn(["bar"]);

            expect(
                filterService.filter([card1, card2], {
                    name: "fö",
                })
            ).toEqual([card1]);
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
                })
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
                })
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
                })
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
                })
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
                })
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
                    linkMarker: ["Top"],
                })
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
                })
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
                })
            ).toEqual([card1, card2]);
        });

        it("filters by ban state", () => {
            const card1 = createCard({
                passcode: "123",
            });
            const card2 = createCard({
                passcode: "789",
            });

            when(
                mockBanlistService.getBanStateByFormat(card1, Format.TCG)
            ).thenReturn(DefaultBanState.LIMITED);
            when(
                mockBanlistService.getBanStateByFormat(card2, Format.TCG)
            ).thenReturn(DefaultBanState.BANNED);

            expect(
                filterService.filter([card1, card2], {
                    banState: DefaultBanState.LIMITED,
                    format: Format.TCG,
                })
            ).toEqual([card1]);
        });

        it("ignores ban state if no format is set", () => {
            const card1 = createCard({
                passcode: "123",
            });
            const card2 = createCard({
                passcode: "789",
            });

            when(
                mockBanlistService.getBanStateByFormat(card1, anything())
            ).thenReturn(DefaultBanState.LIMITED);
            when(
                mockBanlistService.getBanStateByFormat(card2, anything())
            ).thenReturn(DefaultBanState.BANNED);

            expect(
                filterService.filter([card1, card2], {
                    banState: DefaultBanState.LIMITED,
                })
            ).toEqual([card1, card2]);
        });

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
                })
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
                })
            ).toEqual([card1, card2, card3]);
        });
    });
});
