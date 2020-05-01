import "reflect-metadata";
import { TYPES } from "../../../../../src/types";
import {
    CardDatabase,
    FindCardBy,
} from "../../../../../src/core/business/CardDatabase";
import { createCard } from "../../../helper/dataFactories";
import {
    DeckPart,
    DefaultDeckPart,
} from "../../../../../src/core/model/ygo/DeckPart";
import { Card } from "../../../../../src/core/model/ygo/Card";
import { deflate } from "pako";
import { when } from "ts-mockito";
import { MemoryCardDatabase } from "../../../../../src/core/business/MemoryCardDatabase";
import { container } from "../../../../../src/inversify.config";
import { bindMock } from "../../../helper/bindMock";
import { DeckUriEncodingService } from "../../../../../src/core/business/service/DeckUriEncodingService";

describe("DeckUriEncodingService", () => {
    let deckUriEncodingService: DeckUriEncodingService;

    let mockCardDatabase: CardDatabase;

    beforeEach(() => {
        container.snapshot();

        mockCardDatabase = bindMock<CardDatabase>(
            container,
            TYPES.CardDatabase,
            MemoryCardDatabase
        );

        deckUriEncodingService = container.get<DeckUriEncodingService>(
            TYPES.DeckUriEncodingService
        );
    });

    afterEach(() => {
        container.restore();
    });

    describe("fromLegacyUrlQueryParamValue", () => {
        it("puts per deckpart", () => {
            const queryParamValue = deflate("123|*2456|789;999;*3123", {
                to: "string",
            });
            const card1 = createCard({ id: "123" });
            when(mockCardDatabase.hasCard("123", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("123", FindCardBy.ID)).thenReturn(
                card1
            );

            const card2 = createCard({ id: "456" });
            when(mockCardDatabase.hasCard("456", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("456", FindCardBy.ID)).thenReturn(
                card2
            );

            const card3 = createCard({ id: "789" });
            when(mockCardDatabase.hasCard("789", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("789", FindCardBy.ID)).thenReturn(
                card3
            );

            const card4 = createCard({ id: "999" });
            when(mockCardDatabase.hasCard("999", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("999", FindCardBy.ID)).thenReturn(
                card4
            );

            expect(
                deckUriEncodingService.fromLegacyUrlQueryParamValue(
                    queryParamValue,
                    (str: string): string => str
                )
            ).toEqual({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card4, card1, card1, card1]],
                ]),
            });
        });
    });

    describe("toUrlQueryParamValue", () => {
        it("creates value", () => {
            const card1 = createCard({ id: "123" });
            const card2 = createCard({ id: "456" });
            const card3 = createCard({ id: "789" });
            const card4 = createCard({ id: "999999999" });

            const result = deckUriEncodingService.toUrlQueryParamValue({
                name: "foo",
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card4, card1, card1, card1]],
                ]),
            });
            expect(result).toEqual("q2aAgBOMEAwCoswMDP9PzrKuBrJhGATS8vMB");
        });

        it("works with null name", () => {
            const card1 = createCard({ id: "123" });
            const card2 = createCard({ id: "456" });
            const card3 = createCard({ id: "789" });

            const result = deckUriEncodingService.toUrlQueryParamValue({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2]],
                    [DefaultDeckPart.SIDE, [card3]],
                ]),
            });
            expect(result).toEqual("q2aAgBOMEFqUGUIDAA~~");
        });
    });

    describe("fromUrlQueryParamValue", () => {
        it("reads value", () => {
            const card1 = createCard({ id: "123" });
            when(mockCardDatabase.hasCard("123", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("123", FindCardBy.ID)).thenReturn(
                card1
            );

            const card2 = createCard({ id: "456" });
            when(mockCardDatabase.hasCard("456", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("456", FindCardBy.ID)).thenReturn(
                card2
            );

            const card3 = createCard({ id: "789" });
            when(mockCardDatabase.hasCard("789", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("789", FindCardBy.ID)).thenReturn(
                card3
            );

            const card4 = createCard({ id: "999999999" });
            when(
                mockCardDatabase.hasCard("999999999", FindCardBy.ID)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("999999999", FindCardBy.ID)
            ).thenReturn(card4);

            const result = deckUriEncodingService.fromUrlQueryParamValue(
                "q2aAgBOMEAwCoswMDP9PzrKuBrJhGATS8vMB"
            );

            expect(result).toEqual({
                name: "foo",
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2, card2]],
                    [DefaultDeckPart.SIDE, [card3, card4, card1, card1, card1]],
                ]),
            });
        });

        it("works with null name", () => {
            const card1 = createCard({ id: "123" });
            when(mockCardDatabase.hasCard("123", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("123", FindCardBy.ID)).thenReturn(
                card1
            );

            const card2 = createCard({ id: "456" });
            when(mockCardDatabase.hasCard("456", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("456", FindCardBy.ID)).thenReturn(
                card2
            );

            const card3 = createCard({ id: "789" });
            when(mockCardDatabase.hasCard("789", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("789", FindCardBy.ID)).thenReturn(
                card3
            );

            const result = deckUriEncodingService.fromUrlQueryParamValue(
                "q2aAgBOMEFqUGUIDAA~~"
            );

            expect(result).toEqual({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1]],
                    [DefaultDeckPart.EXTRA, [card2]],
                    [DefaultDeckPart.SIDE, [card3]],
                ]),
            });
        });
    });

    describe("toUri", () => {
        it("creates value", () => {
            const card1 = createCard({ id: "5050644" });
            const card2 = createCard({ id: "29189613" });
            const card3 = createCard({ id: "38148100" });

            const result = deckUriEncodingService.toUri({
                name: "foo",
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1, card2, card2]],
                    [DefaultDeckPart.EXTRA, [card3]],
                    [DefaultDeckPart.SIDE, [card1]],
                ]),
            });
            expect(result).toEqual(
                "ydke://FBFNAO1lvQHtZb0B!BBhGAg==!FBFNAA==!"
            );
        });
    });

    describe("fromUri", () => {
        it("reads value", () => {
            const card1 = createCard({ id: "5050644" });
            when(mockCardDatabase.hasCard("5050644", FindCardBy.ID)).thenReturn(
                true
            );
            when(mockCardDatabase.getCard("5050644", FindCardBy.ID)).thenReturn(
                card1
            );

            const card2 = createCard({ id: "29189613" });
            when(
                mockCardDatabase.hasCard("29189613", FindCardBy.ID)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("29189613", FindCardBy.ID)
            ).thenReturn(card2);

            const card3 = createCard({ id: "38148100" });
            when(
                mockCardDatabase.hasCard("38148100", FindCardBy.ID)
            ).thenReturn(true);
            when(
                mockCardDatabase.getCard("38148100", FindCardBy.ID)
            ).thenReturn(card3);

            const result = deckUriEncodingService.fromUri(
                "ydke://FBFNAO1lvQHtZb0B!BBhGAg==!FBFNAA==!"
            );

            expect(result).toEqual({
                name: null,
                parts: new Map<DeckPart, Card[]>([
                    [DefaultDeckPart.MAIN, [card1, card2, card2]],
                    [DefaultDeckPart.EXTRA, [card3]],
                    [DefaultDeckPart.SIDE, [card1]],
                ]),
            });
        });
    });
});
