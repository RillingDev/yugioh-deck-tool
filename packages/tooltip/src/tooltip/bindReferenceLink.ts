import { tooltipContainer } from "../inversify.config";
import { TOOLTIP_TYPES } from "../types";
import type { Card, CardService } from "../../../core/src/main";
import { browserSupportsTouch } from "../../../ui/src/main";

const cardService = tooltipContainer.get<CardService>(
    TOOLTIP_TYPES.CardService
);

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
        isHrefBlank(target) // Only bind if no link is set already
    ) {
        target.href = cardService.getReferenceLink(card);
        target.target = "_blank";
    }
};
