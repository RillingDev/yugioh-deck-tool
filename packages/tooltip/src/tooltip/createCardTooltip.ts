import {
    Card,
    CardTypeGroup,
    DEFAULT_VENDOR_ARR,
    Format,
    PriceService,
} from "yugioh-deck-tool-core/src/main";
import { tooltipContainer } from "../inversify.config";
import { TOOLTIP_TYPES } from "../types";

const priceService = tooltipContainer.get<PriceService>(
    TOOLTIP_TYPES.PriceService
);

const createElement = (classes: string[], type: string): HTMLElement => {
    const element = document.createElement(type);
    classes.forEach((className) => element.classList.add(className));
    return element;
};

const createDiv = (
    classes: string[],
    children: HTMLElement[]
): HTMLDivElement => {
    const element = createElement(classes, "div") as HTMLDivElement;
    children.forEach((child) => element.appendChild(child));
    return element;
};

const createSpan = (
    classes: string[],
    textContent: string
): HTMLSpanElement => {
    const element = createElement(classes, "span") as HTMLSpanElement;
    element.textContent = textContent;
    return element;
};

const createParagraph = (
    classes: string[],
    textContent: string
): HTMLSpanElement => {
    const element = createElement(classes, "p") as HTMLParagraphElement;
    element.textContent = textContent;
    return element;
};

const createImg = (classes: string[], src: string): HTMLImageElement => {
    const element = createElement(classes, "img") as HTMLImageElement;
    element.src = src;
    return element;
};

export const createLoadingTooltip = (): HTMLElement =>
    createDiv(
        ["card-tooltip__content", "card-tooltip__content--loading"],
        [
            createDiv(
                ["card-tooltip__loading"],
                [
                    createSpan(["fas", "fa-spinner", "fa-spin"], ""),
                    createSpan([], "Loading..."),
                ]
            ),
        ]
    );

export const createErrorTooltip = (message: string): HTMLElement =>
    createDiv(
        ["card-tooltip__content", "card-tooltip__content--error"],
        [
            createDiv(
                ["card-tooltip__error"],
                [createSpan(["fas", "fa-times"], ""), createSpan([], message)]
            ),
        ]
    );

const createMonsterStats = (card: Card): HTMLElement => {
    const statsChildren: HTMLElement[] = [];
    const statImage = createImg(
        [],
        "https://ygoprodeck.com/wp-content/uploads/2017/01/atk.png"
    );
    statsChildren.push(statImage);
    if (card.atk != null) {
        statsChildren.push(createSpan([], `ATK/ ${card.atk}`));
    }
    if (card.def != null) {
        statsChildren.push(createSpan([], `DEF/ ${card.def}`));
    } else if (card.linkVal != null) {
        statsChildren.push(createSpan([], `LINK-${card.linkVal}`));
    }
    return createDiv(["card-tooltip__stats"], statsChildren);
};

const createSubType = (card: Card): HTMLElement => {
    const subTypeChildren: HTMLElement[] = [];

    if (card.type.group === CardTypeGroup.MONSTER) {
        subTypeChildren.push(
            createImg(
                [],
                `https://ygoprodeck.com/pics/${encodeURIComponent(
                    card.attribute!
                )}.jpg`
            )
        );
        subTypeChildren.push(createSpan([], `Attribute: ${card.attribute!}`));

        subTypeChildren.push(
            createImg(
                [],
                `https://ygoprodeck.com/pics/${encodeURIComponent(
                    card.race
                )}.png`
            )
        );
        subTypeChildren.push(createSpan([], `Type: ${card.race}`));
    } else {
        subTypeChildren.push(
            createImg(
                [],
                `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
                    card.race
                )}.png`
            )
        );
        subTypeChildren.push(createSpan([], `Type: ${card.race}`));
    }

    return createDiv(["card-tooltip__subtype"], subTypeChildren);
};

const createPrice = (card: Card): HTMLElement => {
    const priceItems: HTMLElement[] = [];
    for (const vendor of DEFAULT_VENDOR_ARR) {
        const lookupResult = priceService.getPrice([card], vendor, null);
        if (lookupResult.missing.length > 0) {
            continue;
        }
        const priceItem = createSpan(
            [
                "card-tooltip__price__vendor",
                `card-tooltip__price__vendor--${vendor.id}`,
            ],
            `${vendor.name}: ${priceService.formatPrice(
                lookupResult.price,
                vendor.currency
            )}`
        );
        priceItems.push(priceItem);
    }
    return createDiv(["card-tooltip__price"], priceItems);
};

const createDescription = (card: Card): HTMLElement =>
    createDiv(
        ["card-tooltip__description"],
        card.desc.split("\n").map((paragraph) => createParagraph([], paragraph))
    );

const createCardDetailsCol = (card: Card): HTMLElement => {
    const children: HTMLElement[] = [];

    const primaryDetails = createDiv(
        ["card-tooltip__details"],
        [
            createImg(
                [],
                `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
                    card.type.name
                )}.jpg`
            ),
            createSpan(["card-tooltip__name"], card.name),
            createImg(
                [],
                `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
                    card.banlist[Format.TCG].name
                )}.png`
            ),
        ]
    );
    children.push(primaryDetails);

    if (card.type.group === CardTypeGroup.MONSTER) {
        children.push(createMonsterStats(card));
    }

    if (card.type.group !== CardTypeGroup.SKILL) {
        children.push(createSubType(card));
    }

    if (card.type.group === CardTypeGroup.MONSTER) {
        if (card.level != null) {
            const level = createDiv(
                ["card-tooltip__level"],
                [
                    createImg(
                        [],
                        "https://ygoprodeck.com/wp-content/uploads/2017/01/level.png"
                    ),
                    createSpan([], `Level/Rank: ${card.level}`),
                ]
            );
            children.push(level);
        } else if (card.linkMarkers != null) {
            const linkMarkers = createDiv(
                ["card-tooltip__link-markers"],
                [
                    createImg(
                        [],
                        "https://ygoprodeck.com/wp-content/uploads/2019/04/link-arrow-right.png"
                    ),
                    createSpan(
                        [],
                        `Link Markers: ${card.linkMarkers.join(", ")}`
                    ),
                ]
            );
            children.push(linkMarkers);
        }
    }

    children.push(createDescription(card));

    children.push(createPrice(card));

    return createDiv(["card-tooltip__details__col"], children);
};

const createCardImageCol = (card: Card): HTMLElement => {
    const cardImage = createImg(
        ["card-tooltip__image"],
        card.image?.url ?? "#"
    );
    return createDiv(["card-tooltip__image__col"], [cardImage]);
};

export const createCardTooltip = (card: Card): HTMLElement =>
    createDiv(
        ["card-tooltip"],
        [
            createDiv(
                ["card-tooltip__content"],
                [createCardDetailsCol(card), createCardImageCol(card)]
            ),
        ]
    );
