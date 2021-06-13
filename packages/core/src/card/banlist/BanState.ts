import { deepFreeze } from "lightdash";

export interface BanState {
    readonly name: string;
    readonly count: number;
}

const DefaultBanState = {
    UNLIMITED: { name: "Unlimited", count: 3 },
    SEMI_LIMITED: { name: "Semi-Limited", count: 2 },
    LIMITED: { name: "Limited", count: 1 },
    BANNED: { name: "Banned", count: 0 },
} as const;
deepFreeze(DefaultBanState);
export { DefaultBanState };

const DEFAULT_BAN_STATE_ARR = [
    DefaultBanState.UNLIMITED,
    DefaultBanState.SEMI_LIMITED,
    DefaultBanState.LIMITED,
    DefaultBanState.BANNED,
];
deepFreeze(DEFAULT_BAN_STATE_ARR);
export { DEFAULT_BAN_STATE_ARR };
