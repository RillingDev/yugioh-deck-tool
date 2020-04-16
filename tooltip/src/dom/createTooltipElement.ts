import {
    Card,
    CardTypeGroup,
    DEFAULT_CURRENCY,
    Format,
} from "../../../core/src/main";
import {
    createDiv,
    createElement,
    createImg,
    createParagraph,
    createSpan,
} from "./domHelper";

const currencyFormat = new Intl.NumberFormat(DEFAULT_CURRENCY.locale, {
    style: "currency",
    currency: DEFAULT_CURRENCY.id,
    minimumFractionDigits: DEFAULT_CURRENCY.fractionDigits,
    maximumFractionDigits: DEFAULT_CURRENCY.fractionDigits,
});

const createStats = (card: Card): HTMLElement => {
    const statsChildren: HTMLElement[] = [];
    const statImage = createImg(
        "https://ygoprodeck.com/wp-content/uploads/2017/01/atk.png"
    );
    statsChildren.push(statImage);
    if (card.atk != null) {
        statsChildren.push(createSpan(`ATK/ ${card.atk}`));
    }
    if (card.def != null) {
        statsChildren.push(createSpan(`DEF/ ${card.def}`));
    } else if (card.linkVal != null) {
        statsChildren.push(createSpan(`LINK-${card.linkVal}`));
    }
    return createDiv(statsChildren, ["yugioh-tooltip__content__stats"]);
};

const createSubType = (card: Card, isMonster: boolean): HTMLElement => {
    const subTypeChildren: HTMLElement[] = [];

    if (isMonster) {
        const attribute = createDiv([
            createImg(
                `https://ygoprodeck.com/pics/${encodeURIComponent(
                    card.attribute!
                )}.jpg`
            ),
            createSpan(`Attribute: ${card.attribute!}`),
        ]);
        subTypeChildren.push(attribute);

        const race = createDiv([
            createImg(
                `https://ygoprodeck.com/pics/${encodeURIComponent(
                    card.race
                )}.png`
            ),
            createSpan(`Race: ${card.race}`),
        ]);
        subTypeChildren.push(race);
    } else {
        const subtype = createDiv([
            createImg(
                `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
                    card.race
                )}.png`
            ),
            createSpan(`Sub-type: ${card.race}`),
        ]);
        subTypeChildren.push(subtype);
    }

    return createDiv(subTypeChildren, ["yugioh-tooltip__content__subtype"]);
};

const createLevel = (card: Card): HTMLElement =>
    createDiv([
        createImg(
            "https://ygoprodeck.com/wp-content/uploads/2017/01/level.png"
        ),
        createSpan(`Level/Rank: ${card.level}`),
    ]);

const createLinkMarkers = (card: Card): HTMLElement =>
    createDiv([
        createImg(
            "https://ygoprodeck.com/wp-content/uploads/2019/04/link-arrow-right.png"
        ),
        createSpan(`Link Markers: ${card.linkMarkers!.join(", ")}`),
    ]);

const createType = (card: Card): HTMLElement => {
    return createDiv([
        createImg(
            `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
                card.type.name
            )}.jpg`
        ),
    ]);
};

const createCardDetails = (card: Card): HTMLElement => {
    const children: HTMLElement[] = [];

    const name = createSpan(card.name);
    children.push(name);

    const type = createType(card);
    children.push(type);

    const banState = createImg(
        `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
            card.banlist[Format.TCG].name
        )}.png`
    );
    children.push(banState);

    const isMonster = card.type.group === CardTypeGroup.MONSTER;
    if (isMonster) {
        children.push(createStats(card));
    }

    children.push(createSubType(card, isMonster));

    if (isMonster) {
        if (card.level != null) {
            children.push(createLevel(card));
        } else if (card.linkMarkers != null) {
            children.push(createLinkMarkers(card));
        }
    }

    const desc = createDiv([createParagraph(card.desc)]);
    children.push(desc);

    return createDiv(children, ["yugioh-tooltip__content__details"]);
};

const createCardImage = (card: Card): HTMLElement =>
    createImg(card.image?.url ?? "#", ["yugioh-tooltip__content__image"]);

const createVote = (val: number, icon: string): HTMLElement =>
    createDiv([
        createSpan("", ["fa", `fa-arrow-${icon}`]),
        createSpan(String(val)),
    ]);

const createCardMisc = (card: Card): HTMLElement => {
    const prices = createElement("ul", [
        "yugioh-tooltip__content__misc__prices",
    ]);
    for (const [vendor, price] of card.prices.entries()) {
        const priceItem = createElement("li");
        priceItem.textContent = `${vendor.name}: ${currencyFormat.format(
            price
        )}`;
        prices.appendChild(priceItem);
    }
    const votes = createDiv(
        [createVote(card.votes.up, "up"), createVote(card.votes.down, "down")],
        ["yugioh-tooltip__content__misc__prices"]
    );

    return createDiv([prices, votes], ["yugioh-tooltip__content__misc"]);
};

export const createTooltipElement = (card: Card): HTMLElement =>
    createDiv(
        [createCardDetails(card), createCardImage(card), createCardMisc(card)],
        ["yugioh-tooltip__content"]
    );
