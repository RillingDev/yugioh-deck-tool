import { BanlistInfo, Card, CardTypeCategory } from "../../core/src/main";

export const imageUrlType = (card: Card): string =>
    `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
        card.type.name
    )}.jpg`;
export const imageUrlSubType = (card: Card): string =>
    card.type.category === CardTypeCategory.MONSTER
        ? `https://ygoprodeck.com/pics/${encodeURIComponent(card.subType)}.png`
        : `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
              card.subType
          )}.png`;

export const imageUrlAttribute = (card: Card): string =>
    `https://ygoprodeck.com/pics/${encodeURIComponent(card.attribute!)}.jpg`;
export const imageUrlAtk = (): string =>
    "https://ygoprodeck.com/wp-content/uploads/2017/01/atk.png";
export const imageUrlLevel = (): string =>
    "https://ygoprodeck.com/wp-content/uploads/2017/01/level.png";
export const imageUrlLinkMarker = (): string =>
    "https://ygoprodeck.com/wp-content/uploads/2019/04/link-arrow-right.png";

export const imageUrlBanState = (
    card: Card,
    format: keyof BanlistInfo
): string =>
    `https://ygoprodeck.com/pics/icons/${encodeURIComponent(
        card.banlist[format].name
    )}.png`;

export const imageUrlCardPlaceholder = (): string =>
    "https://ygoprodeck.com/pics/4035199.jpg";
