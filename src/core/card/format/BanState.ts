import { asConstant } from "@/core/util";

export interface BanState {
	name: string;
	count: number;
}

export const DefaultBanState = {
	UNLIMITED: asConstant({ name: "Unlimited", count: 3 }),
	SEMI_LIMITED: asConstant({ name: "Semi-Limited", count: 2 }),
	LIMITED: asConstant({ name: "Limited", count: 1 }),
	BANNED: asConstant({ name: "Banned", count: 0 }),
} as const;

export const DEFAULT_BAN_STATE_ARR: readonly BanState[] = [
	DefaultBanState.UNLIMITED,
	DefaultBanState.SEMI_LIMITED,
	DefaultBanState.LIMITED,
	DefaultBanState.BANNED,
];
