import { deepFreeze } from "lightdash";
import { DeckPart } from "./DeckPart";

interface DeckPartConfig {
    readonly name: string;
    readonly indicator: string;
    readonly min: number;
    readonly max: number;
    readonly recommended: number;
}

// Pseudo-enum of deck parts
const DefaultDeckPartConfig: {
    readonly [DeckPart.MAIN]: DeckPartConfig;
    readonly [DeckPart.EXTRA]: DeckPartConfig;
    readonly [DeckPart.SIDE]: DeckPartConfig;
} = {
    [DeckPart.MAIN]: {
        name: "Main",
        indicator: "#main",
        min: 40,
        max: 60,
        recommended: 40,
    },
    [DeckPart.EXTRA]: {
        name: "Extra",
        indicator: "#extra",
        min: 0,
        max: 15,
        recommended: 15,
    },
    [DeckPart.SIDE]: {
        name: "Side",
        indicator: "!side",
        min: 0,
        max: 15,
        recommended: 15,
    },
};
deepFreeze(DefaultDeckPartConfig);

export { DeckPartConfig, DefaultDeckPartConfig };
