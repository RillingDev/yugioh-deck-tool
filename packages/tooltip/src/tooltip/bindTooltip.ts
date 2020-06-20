import { tooltipContainer } from "../inversify.config";
import {
    Card,
    CardDatabase,
    CardDataLoaderService,
    FindCardBy,
    getLogger,
} from "../../../core/src/main";
import { TOOLTIP_TYPES } from "../types";
import {
    createCardTooltip,
    createErrorTooltip,
    createLoadingTooltip,
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

const logger = getLogger("bindTooltip");

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

const loadCard = async (cardKey: string): Promise<Card> => {
    let resolvedCardKey = await cardDatabase.prepareCard(
        cardKey,
        FindCardBy.NAME
    );
    if (
        resolvedCardKey != null &&
        cardDatabase.hasCard(resolvedCardKey, FindCardBy.NAME)
    ) {
        return cardDatabase.getCard(resolvedCardKey, FindCardBy.NAME)!;
    }
    resolvedCardKey = await cardDatabase.prepareCard(
        cardKey,
        FindCardBy.PASSCODE
    );
    if (
        resolvedCardKey != null &&
        cardDatabase.hasCard(resolvedCardKey, FindCardBy.PASSCODE)
    ) {
        return cardDatabase.getCard(resolvedCardKey, FindCardBy.PASSCODE)!;
    }
    throw new Error(`Could not find card '${cardKey}'.`);
};

export const bindTooltipHandlers = (
    context: HTMLElement,
    tooltipContainerElement: HTMLElement
): void => {
    const tooltip = new CardTooltip(tooltipContainerElement);

    const openTooltip = (target: HTMLElement, cardKey: string): void => {
        logger.trace(`Attempting to show tooltip for '${cardKey}'.`);
        tooltip.open(target, createLoadingTooltip());
        loadCard(cardKey)
            .then((card) => {
                logger.trace("Loaded card.", card);
                tooltip.open(target, createCardTooltip(card));
                if (target instanceof HTMLAnchorElement) {
                    bindReferenceLink(target, card);
                }
                // Start request, but do not wait for it to finish.
                cardDataLoaderService
                    .updateViews(card)
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

    const tooltipShowHandler = (event: MouseEvent): void => {
        const target = event.target;
        if (target instanceof HTMLElement) {
            const cardKey = target.dataset["name"];
            if (cardKey != null) {
                openTooltip(target, cardKey);
            }
        }
    };

    const tooltipHideHandler = (): void => tooltip.close();

    context.addEventListener("mouseover", debounce(tooltipShowHandler, 400));
    context.addEventListener("mouseout", tooltipHideHandler);
    context.addEventListener("dragstart", tooltipHideHandler);
};
