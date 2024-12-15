export interface BanState {
	readonly name: string;
	readonly count: number;
}

export const DefaultBanState = {
	UNLIMITED: { name: "Unlimited", count: 3 },
	SEMI_LIMITED: { name: "Semi-Limited", count: 2 },
	LIMITED: { name: "Limited", count: 1 },
	BANNED: { name: "Banned", count: 0 },
} as const;

export const DEFAULT_BAN_STATE_ARR: readonly BanState[] = [
	DefaultBanState.UNLIMITED,
	DefaultBanState.SEMI_LIMITED,
	DefaultBanState.LIMITED,
	DefaultBanState.BANNED,
];
