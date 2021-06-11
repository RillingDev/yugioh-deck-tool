import type { DeckPart, DeckService } from "@yugioh-deck-tool/core";
import { TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../inversify.config";
import { useStore } from "../store/store";

// TODO: Replace with real types
export type DraggableChangeEventData = any;
export type DraggableSpillEventData = any;
export type DraggableMoveValidatorData = any;

// This component prop is used to find the deck part of a component tree.
const deckService = applicationContainer.get<DeckService>(TYPES.DeckService);

/**
 * Contract: Draggable element drop zone MAY have the attribute 'data-deck-part-area'.
 * If it does, the value MUST be one of {@link DeckPart}.
 */
export const findDeckPartForDraggableValidatorData = (
    e: DraggableMoveValidatorData
) => {
    const targetEl: HTMLElement = e.to;
    const areaMarker = targetEl.dataset["deckPartArea"];
    return areaMarker != null ? (areaMarker as DeckPart) : null;
};

export const createMoveInDeckPartValidator =
    (oldDeckPart: DeckPart) =>
    (e: DraggableMoveValidatorData): boolean => {
        const newDeckPart = findDeckPartForDraggableValidatorData(e);
        if (newDeckPart == null) {
            return false;
        }
        const deck = useStore().state.deck.active;
        const format = useStore().state.format.active;
        const card = e.draggedContext.element;

        return deckService.canMove(
            deck,
            card,
            oldDeckPart,
            newDeckPart,
            format
        );
    };

export const createMoveFromBuilderValidator =
    () =>
    (e: DraggableMoveValidatorData): boolean => {
        const newDeckPart = findDeckPartForDraggableValidatorData(e);
        if (newDeckPart == null) {
            return false;
        }
        const deck = useStore().state.deck.active;
        const format = useStore().state.format.active;
        const card = e.draggedContext.element;

        return deckService.canAdd(deck, card, newDeckPart, format);
    };
