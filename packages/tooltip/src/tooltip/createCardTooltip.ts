import {
    Card,
    CardTypeGroup,
    DEFAULT_VENDOR_ARR,
    Format,
    PriceService,
} from "../../../core/src/main";
import { tooltipContainer } from "../inversify.config";
import { TOOLTIP_TYPES } from "../types";
import {
    imageUrlAtk,
    imageUrlAttribute,
    imageUrlBanState,
    imageUrlLevel,
    imageUrlLinkMarker,
    imageUrlSubType,
    imageUrlType,
} from "../../../ui/src/main";

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

const createUl = (
    classes: string[],
    children: HTMLElement[]
): HTMLUListElement => {
    const element = createElement(classes, "ul") as HTMLUListElement;
    children.forEach((child) => element.appendChild(child));
    return element;
};

const createLi = (classes: string[], textContent: string): HTMLLIElement => {
    const element = createElement(classes, "li") as HTMLLIElement;
    element.textContent = textContent;
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
    const statImage = createImg([], imageUrlAtk());
    statsChildren.push(statImage);
    if (card.atk != null) {
        statsChildren.push(createSpan([], `ATK/ ${card.atk}`));
    }
    if (card.def != null) {
        statsChildren.push(createSpan([], `DEF/ ${card.def}`));
    } else if (card.linkRating != null) {
        statsChildren.push(createSpan([], `LINK-${card.linkRating}`));
    }
    return createDiv(["card-tooltip__stats"], statsChildren);
};

const createSubType = (card: Card): HTMLElement => {
    const subTypeChildren: HTMLElement[] = [];

    if (card.type.group === CardTypeGroup.MONSTER) {
        subTypeChildren.push(createImg([], imageUrlAttribute(card)));
        subTypeChildren.push(createSpan([], `Attribute: ${card.attribute!}`));
    }
    subTypeChildren.push(createImg([], imageUrlSubType(card)));
    subTypeChildren.push(createSpan([], `Type: ${card.subType}`));

    return createDiv(["card-tooltip__subtype"], subTypeChildren);
};

const createPrice = (card: Card): HTMLElement => {
    const priceItems: HTMLElement[] = [];
    for (const vendor of DEFAULT_VENDOR_ARR) {
        const lookupResult = priceService.getPrice([card], vendor, null);
        if (lookupResult.missing.length > 0) {
            continue;
        }
        const priceItem = createLi(
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
    return createUl(["card-tooltip__price"], priceItems);
};

const createDescription = (card: Card): HTMLElement =>
    createDiv(
        ["card-tooltip__description"],
        card.description
            .split("\n")
            .map((paragraph) => createParagraph([], paragraph))
    );

const createCardDetailsCol = (card: Card): HTMLElement => {
    const children: HTMLElement[] = [];

    const primaryDetails = createDiv(
        ["card-tooltip__details"],
        [
            createImg([], imageUrlType(card)),
            createSpan(["card-tooltip__name"], card.name),
            createImg([], imageUrlBanState(card, Format.TCG)),
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
                    createImg([], imageUrlLevel()),
                    createSpan([], `Level/Rank: ${card.level}`),
                ]
            );
            children.push(level);
        } else if (card.linkMarkers != null) {
            const linkMarkers = createDiv(
                ["card-tooltip__link-markers"],
                [
                    createImg([], imageUrlLinkMarker()),
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
