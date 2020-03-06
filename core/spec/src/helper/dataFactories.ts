import { Card } from "../../../src/core/model/Card";
import { BanState } from "../../../src/core/model/BanState";
import { Format } from "../../../src/core/model/Format";
import { CardSetAppearance } from "../../../src/core/model/CardSetAppearance";
import { CardImage } from "../../../src/core/model/CardImage";
import { CardPrices } from "../../../src/core/model/CardPrices";
import { ReleaseInfo } from "../../../src/core/model/ReleaseInfo";
import { BanlistInfo } from "../../../src/core/model/BanlistInfo";

interface CardCreationData {
    id?: string;
    name?: string;
    desc?: string;

    type?: string;
    race?: string;
    attribute?: string | null;
    atk?: number | null;
    def?: number | null;
    level?: number | null;
    scale?: number | null;
    linkval?: number | null;
    linkmarkers?: string[] | null;

    sets?: CardSetAppearance[];
    image?: CardImage | null;
    prices?: CardPrices | null;

    betaName?: string | null;
    treatedAs?: string | null;
    archetype?: string | null;
    formats?: Format[];
    release?: ReleaseInfo;
    banlist?: BanlistInfo;

    views?: number;
}

const createCard = (data: CardCreationData): Card => ({
    id: data.id ?? "123",
    name: data.name ?? "name",
    desc: data.desc ?? "desc",
    type: data.type ?? "type",

    race: data.race ?? "race",
    attribute: data.attribute ?? null,
    atk: data.atk ?? null,
    def: data.def ?? null,
    level: data.level ?? null,
    scale: data.scale ?? null,
    linkval: data.linkval ?? null,
    linkmarkers: data.linkmarkers ?? null,

    sets: data.sets ?? [],
    image: data.image ?? null,
    prices: data.prices ?? null,
    betaName: data.betaName ?? null,
    treatedAs: data.treatedAs ?? null,
    archetype: data.archetype ?? null,

    formats: data.formats ?? [],
    release: { [Format.TCG]: data.release?.TCG ?? null, [Format.OCG]: null },
    banlist: {
        [Format.TCG]: data.banlist?.TCG ?? BanState.UNLIMITED,
        [Format.OCG]: data.banlist?.OCG ?? BanState.UNLIMITED,
        [Format.GOAT]: data.banlist?.GOAT ?? BanState.UNLIMITED
    },

    views: 0
});

export { createCard };
