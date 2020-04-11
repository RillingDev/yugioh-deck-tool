import "reflect-metadata";
import { TYPES } from "../../../../../src/types";
import { CardDatabase } from "../../../../../src/core/business/CardDatabase";
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
            when(mockCardDatabase.hasCardById("123")).thenReturn(true);
            when(mockCardDatabase.getCardById("123")).thenReturn(card1);

            const card2 = createCard({ id: "456" });
            when(mockCardDatabase.hasCardById("456")).thenReturn(true);
            when(mockCardDatabase.getCardById("456")).thenReturn(card2);

            const card3 = createCard({ id: "789" });
            when(mockCardDatabase.hasCardById("789")).thenReturn(true);
            when(mockCardDatabase.getCardById("789")).thenReturn(card3);

            const card4 = createCard({ id: "999" });
            when(mockCardDatabase.hasCardById("999")).thenReturn(true);
            when(mockCardDatabase.getCardById("999")).thenReturn(card4);

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
            when(mockCardDatabase.hasCardById("123")).thenReturn(true);
            when(mockCardDatabase.getCardById("123")).thenReturn(card1);

            const card2 = createCard({ id: "456" });
            when(mockCardDatabase.hasCardById("456")).thenReturn(true);
            when(mockCardDatabase.getCardById("456")).thenReturn(card2);

            const card3 = createCard({ id: "789" });
            when(mockCardDatabase.hasCardById("789")).thenReturn(true);
            when(mockCardDatabase.getCardById("789")).thenReturn(card3);

            const card4 = createCard({ id: "999999999" });
            when(mockCardDatabase.hasCardById("999999999")).thenReturn(true);
            when(mockCardDatabase.getCardById("999999999")).thenReturn(card4);

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
            when(mockCardDatabase.hasCardById("123")).thenReturn(true);
            when(mockCardDatabase.getCardById("123")).thenReturn(card1);

            const card2 = createCard({ id: "456" });
            when(mockCardDatabase.hasCardById("456")).thenReturn(true);
            when(mockCardDatabase.getCardById("456")).thenReturn(card2);

            const card3 = createCard({ id: "789" });
            when(mockCardDatabase.hasCardById("789")).thenReturn(true);
            when(mockCardDatabase.getCardById("789")).thenReturn(card3);

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
});
