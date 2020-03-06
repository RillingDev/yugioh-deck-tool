import { Card } from "../../../src/core/model/Card";
import { BanState } from "../../../src/core/model/BanState";
import { Format } from "../../../src/core/model/Format";

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
    release: { [Format.TCG]: null, [Format.OCG]: null },
    banlist: {
        [Format.TCG]: BanState.UNLIMITED,
        [Format.OCG]: BanState.UNLIMITED,
        [Format.GOAT]: BanState.UNLIMITED
    },

    views: 0
});
export { createCard };
