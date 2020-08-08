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
    createErrorTooltip,
    createLoadingTooltip,
    createTooltipElement,
} from "./createTooltipElement";
import { bindReferenceLink } from "./bindReferenceLink";
import { delegate, Instance } from "tippy.js";

const cardDatabase = tooltipContainer.get<CardDatabase>(
    TOOLTIP_TYPES.CardDatabase
);

const cardDataLoaderService = tooltipContainer.get<CardDataLoaderService>(
    TOOLTIP_TYPES.CardDataLoaderService
);

const logger = getLogger("bindTooltip");

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

const showTooltip = (
    instance: Instance,
    target: HTMLElement | HTMLAnchorElement,
    cardKey: string
): void => {
    logger.trace(`Attempting to show tooltip for '${cardKey}'.`);
    loadCard(cardKey)
        .then((card) => {
            logger.trace("Loaded card.", card);
            instance.setContent(createTooltipElement(card));

            if (target instanceof HTMLAnchorElement) {
                bindReferenceLink(target, card);
            }

            // Start request, but do not wait for it to finish.
            cardDataLoaderService
                .updateViews(card)
                .then(() => logger.trace("Updated view count."))
                .catch((err) =>
                    logger.warn("Could not update view count.", err)
                );
        })
        .catch((err) => {
            instance.setContent(
                createErrorTooltip("Error while loading card.")
            );
            logger.error("Error while loading card.", err);
        });
};

export const bindTooltipHandlers = (
    context: HTMLElement,
    tooltipContainerElement: HTMLElement
): Instance =>
    delegate(context, {
        target: "[data-name]",
        appendTo: tooltipContainerElement,
        delay: [200, 0],
        placement: "auto",
        maxWidth: "none",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        allowHTML: true,
        content: () => createLoadingTooltip(),
        onShow: (instance) => {
            const target = instance.reference as HTMLElement;
            const cardKey = target.dataset["name"]!;
            showTooltip(instance, target, cardKey);
        },
    });
