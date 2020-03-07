import { BanState } from "../../../../core";

const BANLISTS = [
    {
        name: "None",
        check: ignored => true,
        getVal: ignored => 3
    },
    {
        name: "TCG",
        check: card => card.banlist.tcg != BanState.BANNED,
        getVal: card => card.banlist.tcg
    },
    {
        name: "OCG",
        check: card => card.banlist.ocg != BanState.BANNED,
        getVal: card => card.banlist.ocg
    },
    {
        name: "GOAT",
        check: card => card.banlist.goat != BanState.BANNED,
        getVal: card => card.banlist.goat
    }
];

export { BANLISTS };
