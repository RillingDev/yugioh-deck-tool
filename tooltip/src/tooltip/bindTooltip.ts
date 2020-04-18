import { tooltipContainer } from "../inversify.config";
import { Card, CardDatabase } from "../../../core/src/main";
import { TOOLTIP_TYPES } from "../types";
import logger from "loglevel";
import { createCardTooltip, createLoadingTooltip } from "./createCardTooltip";
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

    public async open(target: HTMLElement, cardName: string): Promise<Card> {
        logger.trace(`Attempting to show tooltip for '${cardName}'.`);
        this.attachTooltip(target, createLoadingTooltip());
        await cardDatabase.prepareCardByName(cardName);

        const card = cardDatabase.getCardByName(cardName);
        if (card == null) {
            throw new Error(`Could not find card '${cardName}'.`);
        }

        logger.trace("Loaded card.", card);
        this.attachTooltip(target, createCardTooltip(card));
        return card;
    }

    public close(): void {
        if (this.tooltipElement != null) {
            this.tooltipElement.remove();
            this.popperInstance?.destroy();
        }
    }

    private attachTooltip(target: HTMLElement, tooltip: HTMLElement): void {
        this.close();
        this.tooltipElement = tooltip;
        this.popperInstance = createPopper(target, this.tooltipElement, {
            placement: "auto",
        });
        this.tooltipContainerElement.appendChild(this.tooltipElement);
    }
}

export const bindTooltipHandlers = (
    context: HTMLElement,
    tooltipContainerElement: HTMLElement
): void => {
    const tooltip = new CardTooltip(tooltipContainerElement);
    const openTooltip = (target: HTMLElement, cardName: string): void => {
        tooltip
            .open(target, cardName)
            .then((card) => {
                if (
                    target instanceof HTMLAnchorElement &&
                    target.href.length === 0
                ) {
                    bindReferenceLink(target, card);
                }
            })
            .catch((e) =>
                logger.error("An error occurred opening the tooltip.", e)
            );
    };

    const mouseOverHandler = (event: MouseEvent): void => {
        const target = event.target;
        if (target instanceof HTMLElement) {
            const cardName = target.dataset["name"];
            if (cardName != null) {
                openTooltip(target, cardName);
            }
        }
    };
    context.addEventListener("mouseover", debounce(mouseOverHandler, 100));
    context.addEventListener("mouseout", (): void => tooltip.close());
};
