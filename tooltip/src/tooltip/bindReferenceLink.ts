import { tooltipContainer } from "../inversify.config";
import { TOOLTIP_TYPES } from "../types";
import { Card, CardService } from "../../../core/src/main";

const cardService = tooltipContainer.get<CardService>(
    TOOLTIP_TYPES.CardService
);

const browserSupportsTouch = (): boolean => navigator.maxTouchPoints > 0;

export const bindReferenceLink = (
    target: HTMLAnchorElement,
    card: Card
): void => {
    if (
        !browserSupportsTouch() && // On touch devices binding a link causes issues with tooltips.
        target.href.length === 0 // If a link is set already, do not bind one.
    ) {
        target.href = cardService.getReferenceLink(card);
        target.target = "_blank";
    }
};
