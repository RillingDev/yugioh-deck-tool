interface BanState {
    readonly name: string;
    readonly count: number;
}

// Pseudo-enum of ban states
const DefaultBanState: {
    readonly UNLIMITED: BanState;
    readonly SEMI_LIMITED: BanState;
    readonly LIMITED: BanState;
    readonly BANNED: BanState;
} = {
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

export { BanState, DEFAULT_BAN_STATE_ARR, DefaultBanState };
