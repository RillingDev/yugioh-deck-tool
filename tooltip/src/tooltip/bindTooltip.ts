import { tooltipContainer } from "../inversify.config";
import {
    Card,
    CardDatabase,
    CardDataLoaderService,
} from "../../../core/src/main";
import { TOOLTIP_TYPES } from "../types";
import logger from "loglevel";
import {
    createCardTooltip,
    createLoadingTooltip,
    createErrorTooltip,
} from "./createCardTooltip";
import { bindReferenceLink } from "./bindReferenceLink";
import { debounce } from "lodash";
import { createPopper, Instance } from "@popperjs/core";

const cardDatabase = tooltipContainer.get<CardDatabase>(
    TOOLTIP_TYPES.CardDatabase
);

const cardDataLoaderService = tooltipContainer.get<CardDataLoaderService>(
    TOOLTIP_TYPES.CardDataLoaderService
);

class CardTooltip {
    private tooltipElement: HTMLElement | null;
    private popperInstance: Instance | null;

    constructor(private readonly tooltipContainerElement: HTMLElement) {
        this.tooltipElement = null;
        this.popperInstance = null;
    }

    public close(): void {
        if (this.tooltipElement != null) {
            this.tooltipElement.remove();
            this.popperInstance?.destroy();
        }
    }

    public open(target: HTMLElement, tooltip: HTMLElement): void {
        this.close();
        this.tooltipElement = tooltip;
        this.popperInstance = createPopper(target, this.tooltipElement, {
            placement: "auto",
        });
        this.tooltipContainerElement.appendChild(this.tooltipElement);
    }
}

const loadCard = async (cardName: string): Promise<Card> => {
    await cardDatabase.prepareCardByName(cardName);
    const card = cardDatabase.getCardByName(cardName);
    if (card == null) {
        throw new Error(`Could not find card '${cardName}'.`);
    }
    return card;
};

export const bindTooltipHandlers = (
    context: HTMLElement,
    tooltipContainerElement: HTMLElement
): void => {
    const tooltip = new CardTooltip(tooltipContainerElement);

    const openTooltip = (target: HTMLElement, cardName: string): void => {
        logger.trace(`Attempting to show tooltip for '${cardName}'.`);
        tooltip.open(target, createLoadingTooltip());
        loadCard(cardName)
            .then((card) => {
                logger.trace("Loaded card.", card);
                tooltip.open(target, createCardTooltip(card));
                if (
                    target instanceof HTMLAnchorElement &&
                    target.href.length === 0
                ) {
                    bindReferenceLink(target, card);
                }
                // Start request, but do not wait for it to finish.
                cardDataLoaderService
                    .updateViews(cardName)
                    .then(() => logger.trace("Updated view count."))
                    .catch((e) =>
                        logger.warn("Could not update view count.", e)
                    );
            })
            .catch((e) => {
                tooltip.open(
                    target,
                    createErrorTooltip("Error while loading card.")
                );
                logger.error("Error while loading card.", e);
            });
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
