import type { DeckPart, DeckService } from "@yugioh-deck-tool/core";
import { TYPES } from "@yugioh-deck-tool/core";
import { applicationContainer } from "../inversify.config";
import { useStore } from "../store/store";

// TODO: Replace with real types
export type DraggableChangeEventData = any;
export type DraggableSpillEventData = any;
export type DraggableMoveValidatorData = any;

// This component prop is used to find the deck part of a component tree.
export const DECK_PART_PROP = "deckPart";

const deckService = applicationContainer.get<DeckService>(TYPES.DeckService);

const findComponentParentMatching = (
    el: Vue,
    predicate: (current: Vue) => boolean
): Vue | null => {
    let current = el;
    while (current.$parent != current.$root) {
        if (predicate(current)) {
            return current;
        }
        current = current.$parent;
    }
    return null;
};

// Workaround-ish solution to allow fetching the target deck part of a a drag event.
const findDeckPartForComponent = (el: Vue): DeckPart | null =>
    findComponentParentMatching(
        el,
        (current) => current.$props[DECK_PART_PROP] != null
    )?.$props[DECK_PART_PROP];

export const createMoveInDeckPartValidator =
    (oldDeckPart: DeckPart) =>
    (e: DraggableMoveValidatorData): boolean => {
        const target = e.relatedContext.component;
        const newDeckPart = findDeckPartForComponent(target);
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
        const target = e.relatedContext.component;
        const newDeckPart = findDeckPartForComponent(target);
        if (newDeckPart == null) {
            return false;
        }
        const deck = useStore().state.deck.active;
        const format = useStore().state.format.active;
        const card = e.draggedContext.element;

        return deckService.canAdd(deck, card, newDeckPart, format);
    };
