import { tooltipContainer } from "../inversify.config";
import { TOOLTIP_TYPES } from "../types";
import { Card, CardService } from "yugioh-deck-tool-core";

const cardService = tooltipContainer.get<CardService>(
    TOOLTIP_TYPES.CardService
);

const browserSupportsTouch = (): boolean => navigator.maxTouchPoints > 0;

const isHrefBlank = (target: HTMLAnchorElement): boolean => {
    // We use this over HTMLAnchorElement.prototype.href as that returns the current URL if the value is empty.
    const href = target.attributes.getNamedItem("href")?.value;
    return href == null || href === "";
};

export const bindReferenceLink = (
    target: HTMLAnchorElement,
    card: Card
): void => {
    if (
        !browserSupportsTouch() && // On touch devices binding a link causes issues with tooltips.
        isHrefBlank(target) // If a link is set already, do not bind one.
    ) {
        target.href = cardService.getReferenceLink(card);
        target.target = "_blank";
    }
};
