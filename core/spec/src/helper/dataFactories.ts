import { Card } from "../../../src/core/model/Card";
import { Format } from "../../../src/core/model/Format";
import { CardImage } from "../../../src/core/model/CardImage";
import { CardPrices } from "../../../src/core/model/CardPrices";
import { ReleaseInfo } from "../../../src/core/model/ReleaseInfo";
import { BanlistInfo } from "../../../src/core/model/BanlistInfo";
import { CardType } from "../../../src/core/model/CardType";
import { CardSet } from "../../../src/core/model/CardSet";
import { CardTypeGroup } from "../../../src/core/model/CardTypeGroup";
import { DefaultDeckPart } from "../../../src/core/model/DefaultDeckPart";
import { DeckPart } from "../../../src/core/model/DeckPart";
import { DefaultBanState } from "../../../src/core/model/DefaultBanState";

const createCardType = (data: {
    name?: string;
    group?: CardTypeGroup;
    sortGroup?: number;
    deckPart?: Set<DeckPart>;
}): CardType => ({
    name: data.name ?? "Spell Card",
    group: data.group ?? CardTypeGroup.SPELL,
    sortGroup: data.sortGroup ?? 0,
    deckPart:
        data.deckPart ?? new Set([DefaultDeckPart.MAIN, DefaultDeckPart.SIDE])
});

const createCard = (data: {
    id?: string;
    name?: string;
    desc?: string;

    type?: CardType;
    race?: string;
    attribute?: string | null;
    atk?: number | null;
    def?: number | null;
    level?: number | null;
    scale?: number | null;
    linkVal?: number | null;
    linkMarkers?: string[] | null;

    sets?: CardSet[];
    image?: CardImage | null;
    prices?: CardPrices | null;

    betaName?: string | null;
    treatedAs?: string | null;
    archetype?: string | null;
    formats?: Format[];
    release?: ReleaseInfo;
    banlist?: BanlistInfo;

    views?: number;
}): Card => ({
    id: data.id ?? "123",
    name: data.name ?? "name",
    desc: data.desc ?? "desc",
    type: data.type ?? createCardType({}),

    race: data.race ?? "race",
    attribute: data.attribute ?? null,
    atk: data.atk ?? null,
    def: data.def ?? null,
    level: data.level ?? null,
    scale: data.scale ?? null,
    linkVal: data.linkVal ?? null,
    linkMarkers: data.linkMarkers ?? null,

    sets: data.sets ?? [],
    image: data.image ?? null,
    prices: data.prices ?? null,
    betaName: data.betaName ?? null,
    treatedAs: data.treatedAs ?? null,
    archetype: data.archetype ?? null,

    formats: data.formats ?? [Format.TCG, Format.OCG],
    release: { [Format.TCG]: data.release?.TCG ?? null, [Format.OCG]: null },
    banlist: {
        [Format.TCG]: data.banlist?.TCG ?? DefaultBanState.UNLIMITED,
        [Format.OCG]: data.banlist?.OCG ?? DefaultBanState.UNLIMITED,
        [Format.GOAT]: data.banlist?.GOAT ?? DefaultBanState.UNLIMITED
    },

    views: 0
});

export { createCard, createCardType };
