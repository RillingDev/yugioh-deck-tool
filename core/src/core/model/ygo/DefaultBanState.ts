import { BanState } from "./BanState";

interface DefaultBanStates {
    UNLIMITED: BanState;
    SEMI_LIMITED: BanState;
    LIMITED: BanState;
    BANNED: BanState;
}

const DefaultBanState: DefaultBanStates = {
    UNLIMITED: { name: "Unlimited", count: 3 },
    SEMI_LIMITED: { name: "Semi-Limited", count: 2 },
    LIMITED: { name: "Limited", count: 1 },
    BANNED: { name: "Banned", count: 0 }
};

const DEFAULT_BAN_STATE_ARR = [
    DefaultBanState.UNLIMITED,
    DefaultBanState.SEMI_LIMITED,
    DefaultBanState.LIMITED,
    DefaultBanState.BANNED
];

export { DefaultBanState, DEFAULT_BAN_STATE_ARR };
