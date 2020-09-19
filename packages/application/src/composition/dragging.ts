import { DeckPart, DeckService } from "../../../core/src/main";
import { appStore } from "./state/appStore";
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";
import { SetupContext } from "@vue/composition-api";

// TODO: Replace with real types
export type DraggableChangeEventData = any;
export type DraggableSpillEventData = any;
export type DraggableMoveValidatorData = any;

// This component prop is used to find the deck part of a component tree.
export const DECK_PART_PROP = "deckPart";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

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

export const createMoveInDeckPartValidator = (
    context: SetupContext,
    oldDeckPart: DeckPart
) => (e: DraggableMoveValidatorData): boolean => {
    const target = e.relatedContext.component;
    const newDeckPart = findDeckPartForComponent(target);
    if (newDeckPart == null) {
        return false;
    }
    const deck = appStore(context).state.deck.active;
    const format = appStore(context).state.format.active;
    const card = e.draggedContext.element;

    return deckService.canMove(deck, oldDeckPart, newDeckPart, format, card);
};

export const createMoveFromBuilderValidator = (context: SetupContext) => (
    e: DraggableMoveValidatorData
): boolean => {
    const target = e.relatedContext.component;
    const newDeckPart = findDeckPartForComponent(target);
    if (newDeckPart == null) {
        return false;
    }
    const deck = appStore(context).state.deck.active;
    const format = appStore(context).state.format.active;
    const card = e.draggedContext.element;

    return deckService.canAdd(deck, newDeckPart, format, card);
};
