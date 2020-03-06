import { Card } from "../../../src/core/model/Card";
import { BanState } from "../../../src/core/model/BanState";

const createCard = (id: string, name = "name"): Card => ({
    id,
    name,
    desc: "desc",
    type: "type",

    race: "race",
    attribute: null,
    atk: null,
    def: null,
    level: null,
    scale: null,
    linkval: null,
    linkmarkers: null,

    sets: [],
    image: null,
    prices: null,
    betaName: null,
    treatedAs: null,
    archetype: null,

    formats: [],
    release: { ocg: null, tcg: null },
    banlist: {
        ocg: BanState.UNLIMITED,
        tcg: BanState.UNLIMITED,
        goat: BanState.UNLIMITED
    },

    views: 0
});
export { createCard };
