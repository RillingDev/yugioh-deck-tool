import { tooltipContainer } from "../inversify.config";
import { CardService } from "../../../core/src/core/business/service/CardService";
import { TOOLTIP_TYPES } from "../types";
import { Card } from "../../../core/src/main";

const cardService = tooltipContainer.get<CardService>(
    TOOLTIP_TYPES.CardService
);

const browserSupportsTouch = (): boolean => navigator.maxTouchPoints > 0;

export const bindReferenceLink = (
    target: HTMLAnchorElement,
    card: Card
): void => {
    if (!browserSupportsTouch()) {
        target.href = cardService.getReferenceLink(card);
        target.target = "_blank";
    }
};
