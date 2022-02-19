import type { Card, DeckPart } from "@/core/main";

// TODO: Replace with real types
export type DraggableChangeEventData = any;
export type DraggableSpillEventData = any;
export type DraggableMoveValidatorData = any;

/**
 * Contract:
 * Draggable element drop zone MAY have the attribute 'data-deck-part-area'.
 * If it does, the value MUST be one of {@link DeckPart}.
 */
export const findDeckPartForDraggableValidatorData = (
	e: DraggableMoveValidatorData
): DeckPart | null => {
	const targetEl: HTMLElement = e.to;
	const areaMarker = targetEl.dataset["deckPartArea"];
	return areaMarker != null ? (areaMarker as DeckPart) : null;
};

/**
 * Contract:
 * MUST only be used for drag move validation if the draggable element data is a {@link Card}.
 */
export const findCardForDraggableValidatorData = (
	e: DraggableMoveValidatorData
): Card => e.draggedContext.element;
