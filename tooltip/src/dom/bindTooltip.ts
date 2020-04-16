import { tooltipContainer } from "../inversify.config";
import { Card, CardDatabase } from "../../../core/src/main";
import { TOOLTIP_TYPES } from "../types";
import logger from "loglevel";
import { createTooltipElement } from "./createTooltipElement";
import { bindReferenceLink } from "./bindReferenceLink";
import { debounce } from "lodash";
import { createPopper, Instance } from "@popperjs/core";

const cardDatabase = tooltipContainer.get<CardDatabase>(
    TOOLTIP_TYPES.CardDatabase
);

class CardTooltip {
    private tooltipElement: HTMLElement | null;
    private popperInstance: Instance | null;

    constructor(private readonly tooltipContainerElement: HTMLElement) {
        this.tooltipElement = null;
        this.popperInstance = null;
    }

    public open(
        target: HTMLElement,
        cardName: string,
        onTooltipReady: (card: Card) => void
    ): void {
        logger.trace(`Attempting to show tooltip for '${cardName}'.`);
        cardDatabase
            .prepareCardByName(cardName)
            .then(() => {
                const card = cardDatabase.getCardByName(cardName);
                if (card != null) {
                    logger.trace("Loaded card.", card);
                    this.attachTooltip(target, card);
                    onTooltipReady(card);
                } else {
                    logger.warn(`Could not find card '${cardName}'.`);
                }
            })
            .catch((e) => logger.error(e));
    }

    public close(): void {
        if (this.tooltipElement != null) {
            this.tooltipElement.remove();
            this.popperInstance?.destroy();
        }
    }

    private attachTooltip(target: HTMLElement, card: Card): void {
        this.close();

        this.tooltipElement = createTooltipElement(card);
        this.popperInstance = createPopper(target, this.tooltipElement, {
            placement: "top",
        });
        this.tooltipContainerElement.appendChild(this.tooltipElement);
    }
}

export const bindTooltipHandlers = (
    context: HTMLElement,
    tooltipContainerElement: HTMLElement
): void => {
    const tooltip = new CardTooltip(tooltipContainerElement);
    const mouseOverHandler = (event: MouseEvent): void => {
        const target = event.target;
        if (target instanceof HTMLElement) {
            const cardName = target.dataset["name"];
            if (cardName != null) {
                tooltip.open(target, cardName, (card) => {
                    if (
                        target instanceof HTMLAnchorElement &&
                        target.href.length === 0
                    ) {
                        bindReferenceLink(target, card);
                    }
                });
            }
        }
    };
    context.addEventListener("mouseover", debounce(mouseOverHandler, 200));
    context.addEventListener("mouseout", (): void => tooltip.close());
};
